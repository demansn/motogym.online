import {host} from "../config";

export async function setAccessTokenTokenRequest(accessToken) {
    const result = await fetch(`${host}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({accessToken})
    });

    return result.status === 200;
}
