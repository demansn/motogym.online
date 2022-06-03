const { UserInputError } = require('apollo-server-express');
const CompetitionResultTime = require('../utils/CompetitionResultTime');
const { ObjectID, Types } = require('mongodb');

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
            user: {
                ...result.user,
                id: result.user._id
            },
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

    competition.bestTime = findResultBestTime(comp.results);
    competition.results = parseResults(competition);

    return competition;
};

const resolver = {
    Trivial: {
        Competition: {
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
        },
        TypeCompetition: {
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
            const {dataSources} = context;
            const {Competition} = dataSources.models;
            const competition = await Competition
                                        .findOne({_id: args.id})
                                        .populate('results.user')
                                        .populate('type');

            return parseCompetition(competition);
        },
        competitions: async (parent, {type}, context) => {
            const {dataSources} = context;
            const {Competition} = dataSources.models;
            const competitions = await Competition.find({})
                                    .populate('results.user')
                                    .populate('type')

            console.log(competitions[2]);

            return competitions.map(parseCompetition);
        },
        competitionTypes: async (parent, args, context) => {
            const {dataSources} = context;
            const {TypesCompetitions} = dataSources;
            const types = await TypesCompetitions.find();

            return types;
        },
        typeCompetition: async (parent, args, context) => {
            const {dataSources} = context;
            const {TypesCompetitions} = dataSources;
            const type = await TypesCompetitions.findOne({name: args.name});

            return type;
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
        createCompetition: async (parent, args, context) => {
            const {dataSources, currentUser, hasRole, ACCESS_LEVEL} = context;
            const {Competition} = dataSources.models;
            const {competitionInput} = args;

            if (hasRole(ACCESS_LEVEL.MANAGER)) {
                const errors = dataSources.validators.validateCompetitionInput(competitionInput);

                if (errors) {
                    throw new UserInputError('Not valid inputs', {errors});
                }

                //find by name
                const oldCompetition = await Competition.findOne({name: competitionInput.name});

                if (oldCompetition) {
                    throw new UserInputError('Not valid inputs', {
                        errors: {
                            competition: `Competition '${competitionInput.name}' already exists`
                        }
                    });
                }

                const racetrack = await dataSources.fileStorage.addFile(competitionInput.racetrack, 'racetracks');
                const competitionFields = {
                    name: competitionInput.name,
                    description: competitionInput.description,
                    start: competitionInput.start,
                    finish: competitionInput.finish,
                    type: competitionInput.type,
                    racetrack,
                    author: currentUser.id,
                    created: Date.now()
                };

                const competition = new Competition(competitionFields);

                await competition.save();

                return competition;
            } else {
                return null;
            }
        },
        addResult: async (parent, args, context) => {
            try {
                const {dataSources, currentUser, hasRole, ACCESS_LEVEL} = context;
                const {Competition, CompetitionResultStatus} = dataSources;
                const {resultInput} = args;

                console.log(currentUser);

                if (hasRole(ACCESS_LEVEL.DRIVER)) {
                    const competition = await Competition.findOne({_id: resultInput.competitionID});
                    const motorcycle = currentUser.motorcycles.find(({_id}) => resultInput.motorcycleID.toString().indexOf(_id) > -1);

                    if (!competition || !motorcycle) {
                        console.log('not found competition or motorcycle', competition, motorcycle);
                        return null;
                    }

                    const resultFields = {
                        user: currentUser,
                        motorcycle,
                        time: resultInput.time,
                        video: resultInput.video,
                        date: resultInput.date || Date.now(),
                        status: resultInput.video ? CompetitionResultStatus.PENDING : CompetitionResultStatus.WITHOUT_VIDEO
                    };

                    const result = competition.results.create(resultFields);

                    competition.results.push(result);
                    competition.save();

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