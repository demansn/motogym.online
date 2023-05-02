import {NextResponse} from "next/server";
export async function POST() {
    const res = NextResponse.json({success: true});

    console.log('logout');
    res.cookies.delete('accessToken');

    return res;
}
