import {gql} from "graphql-tag";

const DRIVERS_QUERY = gql`
    query {
        drivers {
            isVerified
            id
            email
            profile {
                country
                city
                firstName
                lastName
                birthday
                gender
                age
                avatar
            }
            motorcycles {
                id
                productionYear
                model
                name
                brand
            }
        }
    }
`;

const DRIVER_QUERY = gql`query user($id: ID!) {
    user(id: $id) {
        isVerified
        id
        email
        profile {
            country
            city
            firstName
            lastName
            birthday
            gender
            age
            avatar
        }
    }
}`;

export const driversAPIAdapter = {
    getOne: async (client, resource, params) => {
        const response = await client.query({query: DRIVER_QUERY, variables: params});

        return {data: response.data.user};
    },
    getList: async (client, resource, {sort, pagination, filter}) => {
        const response = await client.query({query: DRIVERS_QUERY});

        return {data: response.data.drivers, total: response.data.drivers.length, pageInfo: {}};
    }
};
