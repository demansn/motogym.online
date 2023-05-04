import dotenv from 'dotenv';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import {createServer} from "http";

dotenv.config();
const port = process.env.PORT || 3003;

import {services} from './ServiceRegistry.js';
import {resolvers} from './resolvers/resolvers.js';
import {typeDefs} from './schema/typeDefs.js';
import {initI18n} from "./localization/initI18n.js";
import {createAuthRouter} from './AuthRouter.js';
import {DataBaseService} from "./db/DataBaseService.js";
import {UsersService} from "./db/UsersService.js";
import {EmailService} from "./email-service/EmailService.js";
import {createContext} from "./Context.js";
import {corsOptionsDelegate} from "./corsOptionsDelegate.js";
import i18next from "i18next";

async function start() {
    services.add('db', new DataBaseService());
    services.add('users', new UsersService());
    services.add('emailTransporter', new EmailService(process.env.TRANSPORT_AUTH_USER, process.env.TRANSPORT_AUTH_PASS));

    const app = express();
    const httpServer = createServer(app);

    await initI18n();

    app.use(async (req, res, next) => {
        const lang = req.headers['accept-language'] || 'en';

        await i18next.changeLanguage(lang);
        next();
    });
    app.use(cors(corsOptionsDelegate));
    app.use(bodyParser.json());
    app.use(graphqlUploadExpress());
    app.use('/auth', await createAuthRouter());

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        playground: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use('/graphql', expressMiddleware(server, {context: createContext}));

    await new Promise((resolve) => httpServer.listen({port}, resolve));

    console.log(`API Server running at http://localhost:${port}`);
}

try {
    start()
        .then(() => console.log('Server initialized!'));
} catch (e) {
    console.error(e);
}
