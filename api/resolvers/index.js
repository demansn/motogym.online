const UserResolver = require('./UserResolver');
const Competition = require('./CompetitionResolver');
const Championship = require('./ChampionshipResolver');
const {CompetitionResultTime} = require('./types/CompetitionResultTime');
const {CompetitionName} = require('./types/CompetitionName');
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        ...UserResolver.Query,
        ...Competition.Query,
        ...Championship.Query,
    },
    Mutation: {
        ...UserResolver.Mutation,
        ...Competition.Mutation,
        ...Championship.Mutation,
    },
    ...UserResolver.Trivial,
    ...Competition.Trivial,
    ...Championship.Trivial,
    CompetitionResultTime,
    CompetitionName
};

module.exports = resolvers;
