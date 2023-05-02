export function getJwtTokenPayload(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);

    return JSON.parse(jsonPayload);
}

export function isJwtTokenExpired(token) {
    const { exp: expiration } = getJwtTokenPayload(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= expiration;
}

export function getJwtTokenExpiresDate(token) {
    const { exp: expiration } = getJwtTokenPayload(token);

    return new Date(expiration * 1000);
}
