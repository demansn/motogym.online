const { validateProfileInput} = require("../validators");
const { ObjectID } = require('mongodb');
const { UserInputError } = require('apollo-server-express');

const resolver = {
    Trivial: {
        UserProfile: {
            age: (profile) => {
                if (profile && profile.birthday) {
                    const birthday = new Date(profile.birthday)
                    const diff_ms = Date.now() - birthday.getTime();
                    const age_dt = new Date(diff_ms);

                    return Math.abs(age_dt.getUTCFullYear() - 1970);
                }

                return 0;
            }
        },
        Motorcycle: {
            user:  async (parent, args, {dataSources}) => {
                const user = await dataSources.models.User.findOne({'motorcycles._id': parent._id})

                return user;
            },
            id: (parent) => {
                return parent._id;
            }
        }
    },
    Query: {
        user: async (_, {id}, {dataSources}) => await dataSources.models.User.findOne({ _id: id}),
        drivers: async (_, __, {dataSources}) => {
            const drivers = await dataSources.models.User.find({'isVerified': true});

            // check
            return drivers.filter( ({profile}) => {
                return profile.firstName && profile.lastName
            });
        }
    },
    Mutation: {
        profile: async (_, {profileInput}, {ACCESS_LEVEL, hasRole, currentUser}) => {
            if (!hasRole(ACCESS_LEVEL.DRIVER)) {
                return null;
            }

            const errors = validateProfileInput(profileInput);

            if (errors) {
                throw new UserInputError('Not valid inputs', {errors});
            }

            for (let key in profileInput) {
                if (currentUser.profile[key] !== undefined) {
                    currentUser.profile[key] = profileInput[key];
                }
            }

            await currentUser.save();

            return currentUser;
        },
        userAvatar: async (_, {file}, {currentUser, dataSources, hasRole, ACCESS_LEVEL}) => {
            if (!hasRole(ACCESS_LEVEL.DRIVER)) {
                return null;
            }
            try {
                if (currentUser.profile.avatar) {
                    await dataSources.fileStorage.removeFile(currentUser.profile.avatar);
                }

                const avatarID = ObjectID();

                currentUser.profile.avatar = await dataSources.fileStorage.addFile(file, 'avatars', avatarID);

                await currentUser.save();

                return currentUser;

            } catch (e) {
                console.error(e);

                return null;
            }

        },
        motorcycle: async (_, {motorcycleInput}, context) => {
            const {hasRole, ACCESS_LEVEL, dataSources, currentUser} = context;

            if (!hasRole(ACCESS_LEVEL.DRIVER)) {
                return false;
            }

            if (motorcycleInput.id) {
                // edit motorcycle
            } else {
                // create new motorcycle
                const motorcycleFields = {
                    brand: motorcycleInput.brand,
                    model: motorcycleInput.model,
                    productionYear: motorcycleInput.productionYear
                };

                const motorcycle = currentUser.motorcycles.create(motorcycleFields);
                currentUser.motorcycles.push(motorcycle);

                await currentUser.save();

                return motorcycle;
            }
        },
        removeMotorcycle: async (_, {id}, context) => {
            const {hasRole, ACCESS_LEVEL, currentUser} = context;

            if (!hasRole(ACCESS_LEVEL.DRIVER)) {
                return null;
            }

            currentUser.motorcycles.id({_id:id}).remove();

            await currentUser.save();

            return true;
        }
    }
};

module.exports = resolver;
