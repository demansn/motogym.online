
export async function authRequest(url, body = {}, lang = 'en') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${url}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({'Content-Type': 'application/json', 'accept-language': lang}),
        cache: 'no-store'
    });

    return await response.json();
}
