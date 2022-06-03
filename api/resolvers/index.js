const UserResolver = require('./User');
const Competition = require('./Competition');
const Authentication = require('./Authentication');
const Championship = require('./ChampionshipResolver');
const {CompetitionResultTime} = require('./types/CompetitionResultTime');
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        ...Authentication.Query,
        ...Authentication.Query,
        ...UserResolver.Query,
        ...Competition.Query,
        ...Championship.Query,
    },
    Mutation: {
        ...Authentication.Mutation,
        ...UserResolver.Mutation,
        ...Competition.Mutation,
        ...Championship.Mutation,
    },
    ...Authentication.Trivial,
    ...UserResolver.Trivial,
    ...Competition.Trivial,
    ...Championship.Trivial,
    CompetitionResultTime
};

module.exports = resolvers;
