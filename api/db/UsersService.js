import {ObjectId} from "mongodb";
import {services} from "../ServiceRegistry.js";
import {hashPassword} from "../utils/utils.js";

export class UsersService {
    #collection;

    async setUsersCollection() {
        if (!this.#collection) {

            const db = await services.get('db').getDB();

            this.#collection = await db.collection('users');
        }

        return this.#collection;
    }
    async findUserByEmail(email){
        return this.findUser({email});
    }
    async findUserByID(userID){
        return await this.findUser({_id: userID });
    }
    async createUser(data) {
        if (!this.#collection) {
            await this.setUsersCollection();
        }

        const result = await this.#collection.insertOne({
            ...data,
            password: await hashPassword(data.password),
            profile: {}, confirmationToken: null, resetPasswordToken: null});

        return await this.findUserByID(result.insertedId);
    }
    async updateUser(userID, fields) {
        if (!this.#collection) {
            await this.setUsersCollection();
        }

        return await this.#collection.updateOne({_id: new ObjectId(userID)}, {$set: fields});
    }

    async findUserByConfirmationToken(confirmationToken) {
        return await this.findUser({confirmationToken});
    }

    async findUserByResetPasswordToken(resetPasswordToken) {
        return await this.findUser({resetPasswordToken});
    }

    async findUser(filter) {
        if (!this.#collection) {
            await this.setUsersCollection();
        }

        return await this.#collection.findOne(filter);
    }

    async getAll(filter) {
        if (!this.#collection) {
            await this.setUsersCollection();
        }

        return await this.#collection.find(filter).toArray();
    }
}
