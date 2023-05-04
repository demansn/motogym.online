import {UserResolver} from './UserResolver.js';
import {CompetitionResolver} from './CompetitionResolver.js';
import {ChampionshipResolver} from './ChampionshipResolver.js';
import types from './types/types.js';
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";

export const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        ...UserResolver.Query,
        ...CompetitionResolver.Query,
        ...ChampionshipResolver.Query,
    },
    Mutation: {
        ...UserResolver.Mutation,
        ...CompetitionResolver.Mutation,
        ...ChampionshipResolver.Mutation,
    },
    ...UserResolver.Trivial,
    ...CompetitionResolver.Trivial,
    ...ChampionshipResolver.Trivial,
    ...types
};
