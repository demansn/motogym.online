import {services} from "./ServiceRegistry.js";
import {verifyAccessToken} from "./utils/utils.js";
import {Collection} from "./db/Collection.js";
import fileStorage from "./file-storage/fileStorage.js";
export const createContext = async ({_res, req, _connection}) => {
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
        const collections = ['competitions', 'results', 'typescompetitions'];
        const loaders = {};

        collections.forEach((collection) => {
            loaders[collection] = new Collection(collection);
        });

        const hasRole = (accessLevel) => {
            let visitorAccessLevel = currentUser ? currentUser.accessLevel : 0;

            return visitorAccessLevel >= accessLevel;
        };

        return {currentUser, hasRole, emailTransporter, users, db, fileStorage, ...loaders, loaders};
    } catch (e) {
        console.error(e);

        throw Error(e);
    }
};
