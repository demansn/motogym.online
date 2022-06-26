import {setCookies} from "cookies-next";

export default function handler(req, res) {
    setCookies('authToken', req.body.authToken, { req, res });

    res.status(200);
    res.end();
};
