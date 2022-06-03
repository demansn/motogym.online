import {removeCookies} from "cookies-next";

export default function handler(req, res) {
    removeCookies('authToken', { req, res });

    res.end();
};