require('dotenv').config()
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const {ACCESS_LEVEL} = require('./config/AccessLevel');
const fileStorage = require('./file-storage');
const {getPayload, getToken} = require('./JWTUtils');
const {createRandomToken} = require('./utils');
const models = require('./models');
const validators = require('./validators');
const emailTransporter = require('./email-transporter');
const {i18next, initI18n} = require('./localization');
const express = require('express');
const {crateDefaultModels} = require('./utils/init_default-competition-type');
const graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
const {MONGO_USER, MONGO_PASSWORD, MONGO_DB_NAME, MONGO_HOST} = process.env;
const PATH_TO_CA_CERT = `${__dirname}/config/ca-certificate.cer`
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB_NAME}?authSource=admin&replicaSet=motogym-db-backup&tls=true&tlsCAFile=${PATH_TO_CA_CERT}`;
const MONGO_LOCAL_URI = 'mongodb://localhost/db';
const secretOrKey = process.env.SECRET_OR_KEY;
const port = process.env.PORT || 3003;

const createContext = async ({_res, req, _connection}) => {
    let currentUser;
    const authorization = req.headers.authorization || '';
    const language = req.headers['accept-language'] || 'en';
    const origin = req.headers.origin;
    const token = authorization.replace('Bearer ', '');
    const hasRole = (accessLevel) => {
        let visitorAccessLevel = currentUser ? currentUser.accessLevel : 0;

        return visitorAccessLevel >= accessLevel;
    };

    try {
        const payload = await getPayload(token);

        currentUser = await (payload ? models.User.findById(payload.id) : null);

        await initI18n({lng: language});
    } catch (e) {
        console.error(e);
    }

    return { currentUser, hasRole, getToken, createRandomToken, i18next, language, origin, ACCESS_LEVEL, emailTransporter };
};

async function start() {
    // Connect to MongoDB
    await mongoose.connect(MONGO_LOCAL_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');

    await crateDefaultModels();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        // playground: true,
        dataSources: () => ({
            validators,
            models,
            fileStorage,
            secretOrKey,
            emailTransporter,
            ...models
        }),
        context: createContext
    });

    await server.start();

    const app = express();

    app.use(graphqlUploadExpress());

    server.applyMiddleware({ app });

    await new Promise(r => app.listen(port, r));

    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`);
}

try {
    start()
        .then(() => console.log('Server initialized!'));
} catch (e) {
    console.error(e);
}
