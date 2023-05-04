import {jwtVerify, SignJWT} from 'jose';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const RANDOM_TOKEN_SECRET = process.env.RANDOM_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const getPayload = async function(token) {
    if (!token) {
        return null;
    }

    try {
        const result = await jwtVerify(token, new TextEncoder().encode(ACCESS_TOKEN_SECRET));

        return result.payload;
    } catch (e) {
        console.log(e);

        return null;
    }
};

export const getRandomToken = async function(payload, expirationTime = '1h') {
    try {
        return await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime(expirationTime)
            .sign(new TextEncoder().encode(RANDOM_TOKEN_SECRET))
    } catch (e) {
        console.log(e);

        return undefined;
    }
}

export const verifyRandomToken = async function(token) {
    try {
        const result = await jwtVerify(token, new TextEncoder().encode(RANDOM_TOKEN_SECRET));

        return result.payload;
    } catch (e) {
        return undefined;
    }
}

export const getAccessToken = async function(payload) {
    try {
        return await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1w')
            .sign(new TextEncoder().encode(ACCESS_TOKEN_SECRET))
    } catch (e) {
        return null;
    }
};

export const verifyAccessToken = async function(token) {
    try {
        const result = await jwtVerify(token, new TextEncoder().encode(ACCESS_TOKEN_SECRET));

        return result.payload;
    } catch (e) {
        return null;
    }
}
export const getRefreshToken = async function(user) {
    try {
        const payload = {email: user.email};

        return await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1w')
            .sign(new TextEncoder().encode(REFRESH_TOKEN_SECRET))
    } catch (e) {
        console.log(e);

        return null;
    }
};

export const verifyRefreshToken = async function(token) {
    new Promise(async (res, rej) => {
        try {
            const result = await jwtVerify(token, new TextEncoder().encode(REFRESH_TOKEN_SECRET));

            res(result.payload);
        } catch (e) {
            rej(e);
        }
    });
};
