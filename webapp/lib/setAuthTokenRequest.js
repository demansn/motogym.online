export async function setAuthTokenRequest(authToken) {
    const result = await fetch('/api/setAuthToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({authToken})
    });

    return result.status === 200;
}