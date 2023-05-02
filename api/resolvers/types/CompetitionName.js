const { GraphQLScalarType, UserInputError } = require('graphql');
const {parseCompetitionName} = require('../../../common/parseCompetitionName');

const CompetitionName = new GraphQLScalarType({
    name: 'CompetitionName',
    description: 'CompetitionName',
    serialize(value) {
        return value;
    },
    parseValue(value) {
        try {
            return parseCompetitionName(value);
        } catch(e) {
            throw e;
        }
    }
});

module.exports = {CompetitionName};
