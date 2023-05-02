const express = require("express");
const {getAccessToken, getRandomToken, verifyRandomToken} = require("./JWTUtils");
const {hashPassword, comparePasswords} = require("./utils");
const {services} = require("./ServiceRegistry");
const {validateRegistrationInput} = require("./validators");
const {ACCESS_LEVEL} = require("./config/AccessLevel");

function errorHandler(e, res) {
    res.status(e.status).json({status: 'error', error: e.error});
}

function getUserPayload(user) {
    return {id: user._id, email: user.email, accessLevel: user.accessLevel, isVerified: user.isVerified};
}

async function addConfirmationTokenAndSendEmail(user, verificationLink) {
    const users = services.get('users');
    const emailTransporter = services.get('emailTransporter');

    user.confirmationToken = await getRandomToken(getUserPayload(user), '1h');

    await users.updateUser(user._id, {confirmationToken: user.confirmationToken});
    await emailTransporter.sendEmailConfirmation(user.email, verificationLink, user.confirmationToken);
}

async function createAuthRouter() {
    const authRouter = express.Router();

    authRouter.post('/signup', async (req, res) => {
        const {email, password, verificationLink} = req.body;
        const users = services.get('users');
        let user = await users.findUserByEmail(email);

        if (user) {
            return res.status(400).json({code: 0, error: 'A user with this email already exists.', status: 'emailAlreadyExists'});
        }

        const error = validateRegistrationInput({email, password});

        if (error) {
            return res.status(401).json(error);
        }

        const userData = {
            email,
            password,
            accessLevel: ACCESS_LEVEL.DRIVER,
        };

        user = await users.createUser(userData);

        await addConfirmationTokenAndSendEmail(user, verificationLink);

        res.json({status: 'ok'});
    });

    authRouter.post('/user-verification', async (req, res) => {
        const users = services.get('users');
        const {token} = req.body;

        if (!token) {
            return res.status(400).json({code: 0, error: 'Invalid token.', status: 'invalidToken'});
        }

        const verifyToken = await verifyRandomToken(token);
        const user = await users.findUserByConfirmationToken(token);

        if (!user) {
            return res.status(400).json({code: 1, error: 'Invalid token.', status: 'invalidToken'});
        }

        if (user && !verifyToken) {
            return res.status(400).json({code: 1, error: 'Token is expired', status: 'tokenExpired'});
        }

        await users.updateUser(user._id, {isVerified: true, confirmationToken: null});

        res.json({status: 'ok'});
    });

    authRouter.post('/set-new-password', async (req, res) => {
        const users = services.get('users');
        const {token, password} = req.body;

        if (!token) {
            return res.status(400).json({code: 0, error: 'Invalid token.', status: 'invalidToken'});
        }

        const verifyToken = await verifyRandomToken(token);
        const user = await users.findUserByResetPasswordToken(token);

        if (!user) {
            return res.status(400).json({code: 1, error: 'Invalid token.', status: 'invalidToken'});
        }

        if (user && !verifyToken) {
            return res.status(400).json({code: 1, error: 'Token is expired', status: 'tokenExpired'});
        }

        const hashedPassword = await hashPassword(password);

        await users.updateUser(user._id, {password: hashedPassword, resetPasswordToken: null});

        res.json({status: 'ok'});
    });

    authRouter.post('/forgot-password', async (req, res) => {
        const users = services.get('users');
        const emailTransporter = services.get('emailTransporter');
        const {email, link} = req.body;
        const user = await users.findUserByEmail(email);

        if (!user) {
            return res.status(400).json({code: 0, error: 'A user with this email does not exist.', status: 'emailDoesNotExist'});
        }

        const resetPasswordToken = await getRandomToken({'':''}, '1h');

        await users.updateUser(user._id, {resetPasswordToken});
        await emailTransporter.sendResetPassword(email, link, resetPasswordToken);

        res.json({status: 'ok'});
    });

    authRouter.post('/login', async (req, res) => {
        try {
            const users = services.get('users');
            const emailTransporter = services.get('emailTransporter');
            const {email, password} = req.body;

            if (!email || !password) {
                res.status(401).json({ error: 'Invalid username or password', code: 0, status: 'invalidEmailOrPassword'});
                return;
            }

            const user = await users.findUserByEmail(email);

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password', code: 1, status: 'invalidEmailOrPassword'});
            }

            const isMatch = await comparePasswords(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid username or password', code: 2, status: 'invalidEmailOrPassword'});
            }

            if (!user.isVerified) {
                user.confirmationToken = await getRandomToken(getUserPayload(user), '1w');

                await users.updateUser(user, {confirmationToken: user.confirmationToken});
                await emailTransporter.sendEmailConfirmation(email, user.confirmationToken);

                return res.status(401).json({error: 'User is not Verified', status: 'userIsNotVerified'});
            }

            const accessToken = await getAccessToken(getUserPayload(user));

            res.json({accessToken});
        } catch (e) {
            console.error(e);
            errorHandler({status: 500, error: 'Server error'}, res);
        }
    });

    return authRouter;
}

module.exports = {
    createAuthRouter
}
