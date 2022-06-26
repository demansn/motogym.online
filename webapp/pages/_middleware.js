import {NextResponse} from "next/server";
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const secretOrKey = process.env.SECRET_OR_KEY;
    const res = NextResponse.next();

    if (req.cookies.authToken) {
        const token = req.cookies.authToken.replace('Bearer ', '');

        try {
            await jwtVerify(token, new TextEncoder().encode(secretOrKey));
        } catch(e) {
            res.clearCookie('authToken');
        }
    }

    return res;
}
