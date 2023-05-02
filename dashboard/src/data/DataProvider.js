import {ApolloClient, InMemoryCache, gql, createHttpLink} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
const { createUploadLink } = require('apollo-upload-client')


export class DataProvider {
    constructor(uri) {
        const authLink = setContext((_, { headers }) => {
            const accessToken = localStorage.getItem('accessToken');

            return {
                headers: {
                    ...headers,
                    authorization: accessToken ? `Bearer ${accessToken}` : "",
                }
            }
        });


        this.client = new ApolloClient({
            link:  authLink.concat(createUploadLink({uri, headers: {'apollo-require-preflight': true, 'Access-Control-Allow-Origin': '*'}})),
            cache: new InMemoryCache(),
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'ignore',
                },
                query: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'all',
                },
            }
        });
    }

    addResourceAPIAdapter(resource, adapter) {
        this[resource] = adapter;
    }

     getResourceAPIAdapter(resource) {
        if (!this[resource]) {
            throw new Error(`Не создан адаптер для ресурса ${resource}`);
        }

        return this[resource];
    }

    async getOne(resource, params) {
        return await this.getResourceAPIAdapter(resource).getOne(this.client, resource, params);
    }

    async getMany(resource, params) {
        return await this.getResourceAPIAdapter(resource).getMany(this.client, resource, params);
    }

    async getList(resource, params) {

        return await this.getResourceAPIAdapter(resource).getList(this.client, resource, params);
    }

    async getManyReference(resource, params) {
        return await this.getResourceAPIAdapter(resource).getManyReference(this.client, resource, params);
    }

    async create(resource, params) {
        return await this.getResourceAPIAdapter(resource).create(this.client, resource, params);
    }

    async update(resource, params) {
        return await this.getResourceAPIAdapter(resource).update(this.client, resource, params);
    }

    async updateMany(resource, params) {
        return await this.getResourceAPIAdapter(resource).updateMany(this.client, resource, params);
    }

    async delete(resource, params) {
        return await this.getResourceAPIAdapter(resource).delete(this.client, resource, params);
    }

    async deleteMany(resource, params) {
        return await this.getResourceAPIAdapter(resource).deleteMany(this.client, resource, params);
    }
}
