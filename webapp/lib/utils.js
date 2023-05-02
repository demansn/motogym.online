
export async function authRequest(url, body = {}) {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${url}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({'Content-Type': 'application/json'}),
        cache: 'no-store'
    });

    return await response.json();
}
