const {services} = require("../ServiceRegistry");
const {ObjectId} = require("mongodb");

class Collection {
    constructor(name) {
        this.name = name;
        this.collection = null;
    }
    async init() {
        const db = await services.get('db').getDB();

        if (db) {
            this.collection = await db.collection(this.name);
        }
    }

    async find(filter) {
        if (!this.collection) {
            await this.init();
        }

        return await this.collection.find(filter).toArray();
    }

    async findOne(filter) {
        if (!this.collection) {
            await this.init();
        }

        return await this.collection.findOne(filter);
    }

    async findByID(id) {
        if (!this.collection) {
            await this.init();
        }

        return await this.collection.findOne({_id: ObjectId(id)});
    }

    async insertOne(fields) {
        if (!this.collection) {
            await this.init();
        }

        const result = await this.collection.insertOne(fields);

        return await this.collection.findOne({_id: result.insertedId});
    }

    async removeByID(id) {
        if (!this.collection) {
            await this.init();
        }

        return await this.collection.deleteOne({_id: ObjectId(id)});
    }
}

module.exports = {Collection};
