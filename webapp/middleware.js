import {NextResponse} from "next/server";
import {isJwtTokenExpired} from "common/jwtUtils";

export async function middleware(req) {

    const data = req.cookies.get('accessToken');

    if (data && data.value) {
        if (isJwtTokenExpired(data.value)) {
            const res =  NextResponse.redirect(new URL('/session-expired', req.url));

            res.cookies.delete('accessToken');


            return res;
        }
    }
}
