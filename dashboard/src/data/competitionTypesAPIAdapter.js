import {gql} from "graphql-tag";

const COMPETITION_TYPES_QUERY = gql`
query {
    competitionTypes {
        id  
        name
    }
}
`;

export const competitionTypesAPIAdapter = {
    getList: async (client, resource, {sort, pagination, filter}) => {
        const response = await client.query({query: COMPETITION_TYPES_QUERY});

        return {data: response.data.competitionTypes, total: response.data.competitionTypes.length, pageInfo: {}};
    }
}
