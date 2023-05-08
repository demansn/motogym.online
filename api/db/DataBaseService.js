import {MongoClient} from 'mongodb';

export class DataBaseService {
    constructor(uri, dbName) {
        this.#uri = uri;
        this.#dbName = dbName;
        this.#db = null;
    }
    #db = null;
    #uri = null;
    #dbName = null;
    async connect() {
        if (!this.#db) {
            const client = new MongoClient(this.#uri, {useUnifiedTopology: true});

            await client.connect();

            this.#db = client.db(this.#dbName);
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
