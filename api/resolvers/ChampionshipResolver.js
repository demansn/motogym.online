import {CompetitionResultTime} from "../utils/CompetitionResultTime.js";

export const ChampionshipResolver = {
    Trivial: {
        Championship: {
            rounds: async (parent, args, context) => {
                const {filter = {}} = args;

                if (filter.number !== undefined) {
                    if (parent.rounds[filter.number]) {
                        return [parent.rounds[filter.number]];
                    }

                    return [];
                }

                return parent.rounds;
            },
            description: (parent, args, context) => {
                const {language} = context;

                if (parent.description[language]) {
                    return parent.description[language];
                }

                if (parent.description["en"]) {
                    return parent.description["en"];
                }

                return ['ru', 'ja', 'ua'].find(ln => parent.description[ln])
            }
        },
        ChampionshipRound: {
            finished: (parent) => {
                const nowTime = new Date(Date.now()).getTime();
                const finishTime = new Date().setTime(new Date(parent.finish).getTime() + (23*60*60*1000) + (59*60*1000));

                return finishTime < nowTime;
            },
            started: (parent) => {
                const nowTime = Date.now();
                const startTime = new Date(parent.start);

                return startTime <= nowTime;
            },
            results: (parent, args, context) => {
                const {filter = {}} = args;
                let minTime = Math.min(...parent.results.map(({time, penalty}) => time + penalty));

                let results = parent.results.map(result => {
                    return {
                        id: result._id,
                        status: result.status,
                        driver: result.driver,
                        motorcycle: result.motorcycle,
                        time: result.time,
                        date: result.date,
                        video: result.video,
                        penalty: result.penalty,
                        gap: (result.time + result.penalty) - minTime,
                        timeRatio: CompetitionResultTime.round10((result.time + result.penalty) / minTime * 100, -3)
                    };
                });

                results = results.sort( (a, b) => {
                    const timeA = (a.time + a.penalty);
                    const timeB = (b.time + b.penalty);

                    if (timeA > timeB) {
                        return 1;
                    } else if (timeA < timeB) {
                        return - 1;
                    }
                    return 0;
                });

                if (filter.user) {
                    results = results.filter(({driver}) => driver._id === filter.user);
                }

                if (filter.status) {
                    results = results.filter(({status}) => status === filter.status);
                }

                if (filter.best) {
                    const resultsByUserID = {};
                    const bestResults = [];

                    results.forEach(result => {
                        if (result.driver) {
                            if (!resultsByUserID[result.driver._id]) {
                                resultsByUserID[result.driver._id] = [];
                            }

                            resultsByUserID[result.driver._id].push(result);
                        }
                    });

                    for (const userID in resultsByUserID) {
                        const userResults = resultsByUserID[userID];

                        if (userResults.length > 1) {
                            const times = userResults.map(({time, penalty}) => time + penalty);
                            const bestTime = Math.min(...times);
                            const indexBestTime = times.indexOf(bestTime);

                            bestResults.push(userResults[indexBestTime]);
                        } else {
                            bestResults.push(userResults[0]);
                        }
                    }

                    results = bestResults;
                }

                results = results.map((result, index) => ({...result, position: index + 1}));

                return results;
            }
        },
        ChampionshipRoundResult: {
            timeMilliseconds: (parent, args, context) => {
                return parent.time;
            },
            totalTime: (parent, args, context) => {
                return parent.time + parent.penalty;
            },
            totalTimeMilliseconds: (parent, args, context) => {
                return parent.time + parent.penalty;
            },
            penalty: parent => parent.penalty / 1000,
            gapMilliseconds: (parent, args, context) => {
                return parent.gap;
            }
        }
    },
    Query: {
        championship: async (_, args, context) => {
            const {id} = args;
            const {dataSources} = context;
            const {Championship} = dataSources;
            const championship = await Championship.findOne({_id: id})
                                            .populate('rounds.results.driver')

            return championship;
        },
        championshipByName: async (_, args, context) => {
            const {name} = args;
            const {dataSources} = context;
            const {Championship} = dataSources;
            const championship = await Championship.findOne({name})
                                            .populate('rounds.results.driver')

            return championship;
        },
        championships: async (_, args, context) => {
            const {fields} = args;
            const {dataSources, hasRole, ACCESS_LEVEL, currentUser} = context;
            const {models, Championship} = dataSources;

            return await Championship.find();
        }
    },
    Mutation: {
        createChampionship: async (_, args, context) => {
            const {fields} = args;
            const {dataSources, hasRole, ACCESS_LEVEL, currentUser} = context;
            const {Championship} = dataSources;

            if (hasRole(ACCESS_LEVEL.MANAGER)) {
                let championship = await Championship.findOne({name: fields.name});

                if (championship) {
                    return null;
                }

                for (const round of fields.rounds) {
                    if (round.racetrack) {
                        round.racetrack = await dataSources.fileStorage.addFile(round.racetrack, 'racetracks');
                    }
                }

                championship = new Championship({...fields, author: currentUser._id});

                await championship.save();

                return championship;
            }

            return null;
        },
        editChampionship: async (_, args, context) => {
            const {fields} = args;
            const {dataSources, hasRole, ACCESS_LEVEL} = context;
            const {Championship} = dataSources;

            if (hasRole(ACCESS_LEVEL.MANAGER)) {
                let championship = await Championship.findOne({_id: fields.id});

                if (!championship) {
                    return null;
                }

                if (fields.name) {
                    const ch = await Championship.findOne({name: fields.name});

                    if (!ch) {
                        championship.name = fields.name;
                    }
                }

                if (fields.description) {
                    championship.description = fields.description;
                }

                if (fields.rounds) {
                    fields.rounds.forEach(roundFields => {
                        const round = championship.rounds.find(({_id}) => _id.equals(roundFields.id));
                        if (roundFields.name) {
                            round.name = roundFields.name;
                        }

                        if (roundFields.start) {
                            round.start = roundFields.start;
                        }

                        if (roundFields.finish) {
                            round.finish = roundFields.finish;
                        }

                        if (roundFields.racetrack) {
                            round.racetrack = roundFields.racetrack;
                        }
                    });
                }

                return championship;
            }

            return null;
        },
        addResultChampionshipRound: async (parent, args, context) => {
            const {dataSources, currentUser: driver, hasRole, ACCESS_LEVEL} = context;
            const {Championship} = dataSources;
            const {fields} = args;

            if (hasRole(ACCESS_LEVEL.DRIVER)) {
                const championship = await Championship.findOne({_id: fields.championship});
                const round = championship.rounds.find(({_id}) => _id.equals(fields.round));
                const motorcycle = driver.motorcycles.find(({_id}) => _id.equals(fields.motorcycle));

                if (!championship || !round || !motorcycle) {
                    return null;
                }

                const nowTime = new Date(Date.now()).getTime();
                const startTime = new Date(round.start).getTime();
                const finishTime = new Date().setTime(new Date(round.finish).getTime() + (23*60*60*1000) + (59*60*1000));
                const isFinished = finishTime < nowTime;

                if (startTime > nowTime || isFinished) {
                    return null;
                }

                const resultFields = {
                    driver: driver.id,
                    motorcycle,
                    time: fields.time,
                    video: fields.video,
                    date: Date.now(),
                    points: -1
                };

                const result = round.results.create(resultFields);

                round.results.push(result);

                await championship.save();

                return {
                    championship,
                    round,
                    result
                };
            }

            return null;
        }
    }
}
