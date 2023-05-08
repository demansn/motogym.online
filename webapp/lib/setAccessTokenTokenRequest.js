import {API_URL} from "../config";

export async function setAccessTokenTokenRequest(accessToken) {
    const result = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({accessToken})
    });

    return result.status === 200;
}
