const {services} = require("./ServiceRegistry");
const {verifyAccessToken} = require("./JWTUtils");
const {Collection} = require("./db/Collection");
const fileStorage = require('./file-storage');
const createContext = async ({_res, req, _connection}) => {
    try {
        console.log('create Context');
        const authorization = req.headers.authorization || '';
        const language = req.headers['accept-language'] || 'en';
        const origin = req.headers.origin;
        const accessToken = authorization.replace('Bearer ', '');
        const users = await services.get('users');
        const emailTransporter = await services.get('emailTransporter');
        const currentUser = await verifyAccessToken(accessToken);
        const db = await services.get('db').getDB();
        const competitions = new Collection('competitions');
        const championships = new Collection('championships');
        const typesCompetitions = new Collection('typescompetitions');

        const hasRole = (accessLevel) => {
            let visitorAccessLevel = currentUser ? currentUser.accessLevel : 0;

            return visitorAccessLevel >= accessLevel;
        };

        return {currentUser, hasRole, emailTransporter, users, db, competitions, championships, typesCompetitions, fileStorage};
    } catch (e) {
        console.error(e);

        throw Error(e);
    }
};

module.exports = {createContext};
