import {server} from "../config";

export async function setAuthTokenRequest(authToken) {
    const result = await fetch(`${server}/api/setAuthToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({authToken})
    });

    return result.status === 200;
}
