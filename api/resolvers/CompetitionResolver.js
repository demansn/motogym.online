const CompetitionResultTime = require('../utils/CompetitionResultTime');
const {GraphQLError} = require("graphql/error");
const {ObjectID, ObjectId} = require("mongodb");
const {validateCompetitionInput} = require("../validators");
const {ACCESS_LEVEL} = require("../config/AccessLevel");

const findResultBestTime = (results) => {
    return Math.min(...results.map(({time, fine}) => time + fine));
};

const sortResultByTime = (resultA, resultB) => {
    const timeA = (resultA.time + resultA.fine);
    const timeB = (resultB.time + resultB.fine);

    if (timeA > timeB) {
        return 1;
    } else if (timeA < timeB) {
        return - 1;
    }
    return 0;
};

const parseResults = (competition) => {
    return competition.results.filter(({user}) => user).map(result => {
        return {
            ...result,
            id: result._id,
            competition
        }
    })
};

const parseCompetition = comp => {
    const competition = {
        ...(comp.toObject !== undefined ? comp.toObject() : comp),
        id: comp._id,
    };

    competition.results = comp.results || [];
    competition.bestTime = findResultBestTime(competition.results);
    competition.results = parseResults(competition);

    return competition;
};

const resolver = {
    Trivial: {
        Competition: {
            type: async (parent, args, {typesCompetitions}) => {
                return await typesCompetitions.findOne({_id: parent.type});
            },
            results: async (parent, args, {currentUser}) => {
                const {filter = {}} = args;
                let results = parent.results.sort(sortResultByTime);

                results = results.map((result, index) => ({...result, position: index + 1}));

                results = results.filter(({status, user, video}) => {
                    let hasResult = true;

                    if ((!video)) {
                        hasResult = currentUser && currentUser._id.toString().indexOf(user._id) > -1;
                    }

                    return hasResult;
                });

                if (filter.user) {
                    results = results.filter(({user}) => user._id.equals(filter.user));
                }

                if (filter.status) {
                    results = results.filter(({status}) => status === filter.status);
                }

                if (filter.best) {
                    const resultsByUserID = {};
                    const bestResults = [];

                    results.forEach(result => {
                        if (!resultsByUserID[result.user._id]) {
                            resultsByUserID[result.user._id] = [];
                        }

                        resultsByUserID[result.user._id].push(result);
                    });

                    for (const userID in resultsByUserID) {
                        const userResults = resultsByUserID[userID];

                        if (userResults.length > 1) {
                            const times = userResults.map(({time, fine}) => time + fine);
                            const bestTime = Math.min(...times);
                            const indexBestTime = times.indexOf(bestTime);

                            bestResults.push(userResults[indexBestTime]);
                        } else {
                            bestResults.push(userResults[0]);
                        }
                    }

                    results = bestResults;
                }

                return results;
            }
        },
        CompetitionResult: {
            gap: (parent) => {
                return (parent.time + parent.fine) - parent.competition.bestTime;
            },
            timeRatio: (parent) => {
                return CompetitionResultTime.round10((parent.time + parent.fine) / parent.competition.bestTime * 100, -3);
            },
            timeMilliseconds: (parent, args, context) => {
                return parent.time;
            },
            totalTime: (parent, args, context) => {
                return parent.time + parent.fine;
            },
            totalTimeMilliseconds: (parent, args, context) => {
                return parent.time + parent.fine;
            },
            fine: parent => parent.fine / 1000,
            gapMilliseconds: (parent, args, context) => {
                return parent.gap;
            },
            user: async (parent, args, {users}) => {
                return await users.findUserByID(parent.user);
            }
        },
        TypeCompetition: {
            id: parent => parent._id,
            regulation: (parent, args, context) => {
                const {language} = context;

                if (parent.regulation[language]) {
                    return parent.regulation[language];
                }

                if (parent.regulation["en"]) {
                    return parent.regulation["en"];
                }

                return ['ru', 'ja', 'ua'].find(ln => parent.regulation[ln])
            }
        }
    },
    Query: {
        competition: async (parent, args, context) => {
            const {competitions} = context;
            const competition = await competitions
                                        .findByID(args.id);

            return competition ? parseCompetition(competition) : null;
        },
        competitionByName: async (parent, {name}, context) => {
            const {competitions} = context;
            const competition = await competitions
                .findOne({name});

            return competition ? parseCompetition(competition) : null;
        },
        competitions: async (parent, {type}, context) => {
            const {competitions: competitionsCollection} = context;
            const competitions = await competitionsCollection.find({});

            return competitions.map(parseCompetition);
        },
        competitionTypes: async (parent, args, {typesCompetitions}) => {
           return await typesCompetitions.find({});
        },
        typeCompetition: async (parent, {name}, {typesCompetitions}) => {
            return await typesCompetitions.findOne({name});
        },
        // resultsOfCompetitions: async (parent, {find}, context) => {
        //     const {dataSources} = context;
        //     const {Competition} = dataSources.models;
        //     let competitions = await Competition.find({'results.user': {_id: find.userID}})
        //         .populate('results.user')
        //         .populate('type');
        //
        //     competitions = competitions.map(parseCompetition);
        //
        //     const results = competitions.map(parseCompetition).reduce((current, competition) => [...current, ...competition.results], []);
        //
        //
        //     return results.filter(({user}) => ObjectID(user.id).equals(find.userID));
        // }
    },
    Mutation: {
        removeCompetition: async (parent, args, context) => {
            const {currentUser, hasRole, competitions, fileStorage} = context;
            const {id} = args;

            if (hasRole(ACCESS_LEVEL.MANAGER)) {
                const competition = await competitions.findByID(id);

                if (competition) {
                    if (competition.author.toString() !== currentUser.id.toString()) {
                        throw new GraphQLError('You do not have permission to delete this competition');
                    }
                    await fileStorage.removeFile(competition.racetrack);
                    await competitions.removeByID(id);

                    return true;
                } else {
                    throw new GraphQLError(`Competition '${id}' not found`);
                }
            } else {
                throw new GraphQLError('You do not have permission to delete competitions');
            }
        },
        createCompetition: async (parent, args, context) => {
            const {currentUser, hasRole, competitions, fileStorage} = context;
            const {competitionInput} = args;

            if (hasRole(ACCESS_LEVEL.MANAGER)) {
                const errors = validateCompetitionInput(competitionInput);

                if (errors) {
                    throw new GraphQLError('Not valid inputs', {errors});
                }

                const oldCompetition = await competitions.findOne({name: competitionInput.name});

                if (oldCompetition) {
                    throw new GraphQLError('Not valid inputs', {
                        errors: {
                            competition: `Competition '${competitionInput.name}' already exists`
                        }
                    });
                }

                const racetrack = await fileStorage.addFile(competitionInput.racetrack, 'racetracks');
                const competitionFields = {
                    name: competitionInput.name,
                    description: competitionInput.description,
                    start: competitionInput.start,
                    finish: competitionInput.finish,
                    type: competitionInput.type,
                    racetrack,
                    author: currentUser.id,
                    created: Date.now(),
                    results: []
                };

                return await competitions.insertOne(competitionFields);
            } else {
                return null;
            }
        },
        addResult: async (parent, args, context) => {
            try {
                const {competitions, users, currentUser, hasRole, ACCESS_LEVEL} = context;
                const {resultInput} = args;

                if (hasRole(ACCESS_LEVEL.DRIVER)) {
                    const competition = await competitions.findOne({_id: resultInput.competitionID});
                    const user = await users.findOne({_id: currentUser.id});
                    const motorcycle = user.motorcycles.find(({_id}) => resultInput.motorcycleID.toString().indexOf(_id) > -1);

                    if (!competition || !motorcycle) {
                        console.log('not found competition or motorcycle', competition, motorcycle);
                        return null;
                    }

                    const resultFields = {
                        user: new ObjectId(currentUser.id),
                        motorcycle: new ObjectId(motorcycle._id),
                        time: resultInput.time,
                        video: resultInput.video,
                        date: resultInput.date || Date.now(),
                        status: resultInput.video ? CompetitionResultStatus.PENDING : CompetitionResultStatus.WITHOUT_VIDEO
                    };

                    const result = competition.results.create(resultFields);

                    competition.results.push(result);

                    await competitions.updateOne({_id: competition._id}, competition);

                    return result;
                } else {
                    console.log('not access');
                }
            } catch (e) {
                console.error(e);
            }

            return null;
        },
        competitionResult: async (parent, args, context) => {
            const {dataSources, currentUser, hasRole, ACCESS_LEVEL, emailTransporter} = context;
            const {Competition, CompetitionResultStatus} = dataSources;

            if (hasRole(ACCESS_LEVEL.MANAGER)) {
                const competition = await Competition
                                        .findOne({_id: args.fields.competition})
                                        .populate('results.user');

                if (!competition || !competition.author.equals(currentUser._id)) {
                    return null;
                }

                const result = competition.results.find(result => {
                    if (args.fields.result.indexOf(result._id) > -1) {
                        return result;
                    }
                });

                if (!result) {
                    return null;
                }

                if (args.fields.status !== undefined) {
                    result.status = args.fields.status;
                }

                if (args.fields.fine !== undefined) {
                    result.fine = args.fields.fine * 1000;
                }

                if (args.fields.message !== undefined) {
                    // send reject message
                    if (result.status === CompetitionResultStatus.REJECTED) {
                        emailTransporter.sendRejectCompetitionResult(result.user.email, competition.name, args.fields.message);
                    }
                }

                await competition.save();

                return result;
            }

            return null;
        }
    }
};

module.exports = resolver;
