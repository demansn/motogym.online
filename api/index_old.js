require('dotenv').config();
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const {i18next, initI18n} = require('./localization');
const express = require('express');
const {crateDefaultModels} = require('./utils/init_default-competition-type');
const graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
const {createAuthRouter} = require("./AuthRouter");
const bodyParser = require("body-parser");
const {services} = require("./ServiceRegistry");
const {EmailService} = require("./email-transporter/Email");
const port = process.env.PORT || 3003;
const cors = require('cors')
const {DataBaseService} = require("./db/DataBaseService");
const {UsersService} = require("./db/UsersService");
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const {ApolloServerPluginDrainHttpServer} = require('@apollo/server/plugin/drainHttpServer');
const {createServer} = require("http");
const {createContext} = require("./Context");
const corsOptionsDelegate = require("./corsOptionsDelegate");

async function start() {
    services.add('db', new DataBaseService());
    services.add('users', new UsersService());
    services.add('emailTransporter', new EmailService(process.env.ORIGIN));

    await initI18n();
    await crateDefaultModels();

    const app = express();
    const httpServer = createServer(app);

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
