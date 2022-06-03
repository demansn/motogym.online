const { UserInputError } = require('apollo-server-express');
const path = require('path');

const resolver = {
    Trivial: {
        Racetrack: {
            map: async (parent, args, context) => {
                const {dataSources} = context;

                return `${dataSources.fileStorage.BASE_URL}/${parent.map}`;
            }
        }
    },
    Query: {
        racetrackAccesses: (parent, args, context) => {
            const {dataSources} = context;
            const {RacetrackAccess} = dataSources.models;

            return Object.values(RacetrackAccess);
        },
        racetracks: async (parent, {access}, {dataSources}) => {
           return dataSources.models.Racetrack.find({access});
        },
        racetrack: async (parent, args, context) => {}
    },
    Mutation: {
        racetrack: async (parent, {racetrackInput}, {currentUser, dataSources, hasRole}) => {
            const {models, validators} = dataSources;
            const { Racetrack } = models;

            if (hasRole('manager')) {
                const errors = validators.validateRacetrackInput(racetrackInput);

                if (errors) {
                    throw new UserInputError('Not valid inputs', {errors});
                }

                //find by name
                let racetrack = await Racetrack.findOne({name: racetrackInput.name});

                if (racetrack) {
                    // update racetrack7
                    return false
                } else {
                    const imageMapURL = await dataSources.fileStorage.addFile(racetrackInput.map, 'racetracks');

                    const racetrackFields = {
                        ...racetrackInput,
                        map: imageMapURL,
                        author: currentUser.id
                    };

                    racetrack = await new Racetrack(racetrackFields);
                }

                await racetrack.save();

                return racetrack;
            } else {
                return null;
            }
        }
    }
};

module.exports = resolver;