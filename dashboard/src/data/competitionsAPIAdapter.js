import {gql} from "graphql-tag";

const COMPETITIONS_QUERY = gql`query {
    competitions {
        id
        name
        racetrack
    }
}`;

const COMPETITION_QUERY = gql`
    query competition($id: ID!) {
        competition(id: $id) {
            id
            name
            racetrack
            description {
                en
                ru
                ua
                ja
            }
        }
}`

const CREATE_COMPETITION = gql`
    mutation createCompetition($competitionInput: CreateCompetitionInput!) {
        createCompetition(competitionInput: $competitionInput) {
            id
            name
        }
    }
`;

const REMOVE_COMPETITION = gql`
    mutation removeCompetition($id: ID!) {
        removeCompetition(id: $id) 
    }
`;

export const competitionsAPIAdapter = {
    getOne: async (client, resource, params) => {
        const response = await client.query({query: COMPETITION_QUERY, variables: params});

        return {data: response.data.competition};
    },
    getList: async (client, resource, {sort, pagination, filter}) => {
        const response = await client.query({query: COMPETITIONS_QUERY});

        return {data: response.data.competitions, total: response.data.competitions.length, pageInfo: {}};
    },
    create: async (client, resource, params) => {

        const competitionInput = params.data;

        competitionInput.racetrack = competitionInput.racetrack.rawFile;

        const response = await client.mutate({mutation: CREATE_COMPETITION, variables: {competitionInput}});

        return {data: response.data.createCompetition};
    },
    delete: async (client, resource, params) => {
        const response = await client.mutate({mutation: REMOVE_COMPETITION, variables: {id: params.id}});

        return {data: response.data.removeCompetition};
    }
}
