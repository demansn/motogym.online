const bcrypt = require('bcryptjs');
const {jwtVerify, SignJWT} = require('jose');
const secretOrKey = process.env.SECRET_OR_KEY;

const getPayload = async function(token) {
    if (!token) {
        return null;
    }

    try {
        return await jwtVerify(token, new TextEncoder().encode(secretOrKey));
    } catch (e) {
        console.log(e);

        return null;
    }
};

const getToken = async function(user) {
    try {
        const payload = { id: user.id, role: user.role, email: user.email };

        return await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('336d')
            .sign(new TextEncoder().encode(secretOrKey))
    } catch (e) {
        console.log(e);

        return null;
    }
};

const generateEmailConfirmationUri = async function(user, origin) {

};

module.exports = {
    getToken,
    getPayload
};
