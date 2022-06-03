const bcrypt = require('bcryptjs');
const {jwtVerify, SignJWT} = require('jose');
const secretOrKey = process.env.SECRET_OR_KEY;

const getPayload = async function(token) {
    if (!token) {
        return null;
    }

    try {
        return await jwtVerify(token, secretOrKey);
    } catch (e) {
        return null;
    }
};

const getToken = async function(user) {
    const payload = { id: user.id, role: user.role, email: user.email };

    return await new SignJWT(payload)
        .setExpirationTime('336d')
        .sign(secretOrKey)
};

const generateEmailConfirmationUri = async function(user, origin) {

};

module.exports = {
    getToken,
    getPayload
};
