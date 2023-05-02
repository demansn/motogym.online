import { NextResponse } from 'next/server';
import {authRequest} from "../../../lib/utils";
export async function POST(req) {
    const {email, password} = await req.json();
    const data = await authRequest('login', {email, password});
    const res = NextResponse.json(data);

    if (data.accessToken) {
        res.cookies.set({
            value: data.accessToken,
            name: 'accessToken',
            secure: 'production' === process.env.NODE_ENV
        });
    }

    return res;
}
