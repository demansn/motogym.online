import {Server} from "./src/Server.js";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const host = 'localhost';
const port = 8000;

const server = new Server(host, port);

// server.addRoute('/auth', (req, res) => {
//     res.writeHead(200);
//     res.end('eee');
// });

server.start();

server.addRoute('/auth', auth);




