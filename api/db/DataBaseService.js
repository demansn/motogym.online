import {MongoClient} from 'mongodb';
const isDev = process.env.NODE_ENV !== 'production';
const { MONGO_URI } = process.env;
const MONGO_LOCAL_URI = 'mongodb://localhost:27017/motogym';
const DB_URI = isDev ? MONGO_LOCAL_URI : MONGO_URI;

export class DataBaseService {
    #db = null;
    async connect() {
        if (!this.#db) {
            const client = new MongoClient(DB_URI, {useUnifiedTopology: true});

            await client.connect();

            this.#db = client.db('motogym-online_dev');
        }

        return this.#db;
    }
    async getDB() {
        if (!this.#db) {
            await this.connect();
        }

        return this.#db;
    }
}
