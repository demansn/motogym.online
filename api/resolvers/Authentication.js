const {validateRegistrationInput} = require("../validators");
const bcrypt = require('bcryptjs');
const {getToken} = require("../JWTUtils");

const resolver = {
    Trivial: {},
    Query: {
        me: (parent, args, { currentUser }) => currentUser
    },
    Mutation: {
        login: async (_, {email, password}, {createRandomToken, dataSources, hasRole, origin, language, ACCESS_LEVEL}) => {
            const {models, emailTransporter} = dataSources;
            const User = models.User;

            if (!hasRole(ACCESS_LEVEL.GUEST)) {
                return false;
            }

            const user = await User.findOne({email});

            if (!user) {
                return false;
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return false;
            }

            if (!user.isVerified) {
                const confirmationToken = createRandomToken();

                user.confirmationToken = {token: confirmationToken};

                await user.save();
                await emailTransporter.sendEmailConfirmation(email,`${origin}/${language}/email-verification?t=${confirmationToken}`);

                return {
                    user
                };
            }

            const token = await getToken(user);

            return {
                user,
                token: `Bearer ${token}`
            };
        },
        passwordRecoveryRequest:  async (_, {email}, context) => {
            const {language, origin, createRandomToken, dataSources} = context;
            const {emailTransporter, models} = dataSources;
            const {User} = models;

            const user = await User.findOne({email});

            if (!user) {
                return false;
            }

            const token = createRandomToken();

            user.passwordResetToken = {token};

            await user.save();
            await emailTransporter.sendResetPassword(email,`${origin}/${language}/reset-password?t=${token}`);

            return true;
        },
        resetPassword:  async (_, {password, token}, context) => {
            const {language, origin, createRandomToken, dataSources, getToken} = context;
            const {emailTransporter, models} = dataSources;
            const {User} = models;
            const user = await User.findOne({'passwordResetToken.token': token});

            if (user) {
                const salt = await bcrypt.genSalt(10);
                let bearerToken = null;

                user.password = await bcrypt.hash(password, salt);
                user.passwordResetToken = null;

                if (!user.isVerified) {
                    const confirmationToken = createRandomToken();

                    user.confirmationToken = {token: confirmationToken};

                    await emailTransporter.sendEmailConfirmation(user.email,`${origin}/${language}/email-verification?t=${confirmationToken}`);
                } else {
                    bearerToken = await getToken(user);
                    bearerToken = `Bearer ${bearerToken}`;
                }

                await user.save();

                return {
                    user,
                    token: bearerToken
                };
            }

            return false;
        },
        userVerification:  async (_, {token}, context) => {
            const {dataSources} = context;
            const {models} = dataSources;
            const {User} = models;
            const user = await User.findOne({'confirmationToken.token':token});

            if (!user) {
                return false;
            }

            if (user.isVerified) {
                return false;
            }

            user.isVerified = true;
            user.confirmationToken = null;

            await user.save();

            const bearerToken = await getToken(user);

            return {
                user,
                token: `Bearer ${bearerToken}`
            };
        },
        registration: async (_, args, context) => {
            const {registrationInput} = args;
            const {dataSources, hasRole, language, origin, createRandomToken, ACCESS_LEVEL} = context;
            const {models, emailTransporter} = dataSources;
            const {User} = models;

            if (!hasRole(ACCESS_LEVEL.GUEST)) {
                return false;
            }

            let {email, password} = registrationInput;
            const user = await User.findOne({email});
            const errors = validateRegistrationInput(registrationInput);

            if (user || errors) {
                return false;
            }

            const confirmationToken = createRandomToken();
            const salt = await bcrypt.genSalt(10);

            password = await bcrypt.hash(password, salt);

            const newUser = new User({
                email,
                password,
                confirmationToken: {
                    token: confirmationToken
                },
                profile: {}
            });

            await newUser.save();
            await emailTransporter.sendEmailConfirmation(email,`${origin}/${language}/email-verification?t=${confirmationToken}`);

            return true;
        }
    }
};

module.exports = resolver;
