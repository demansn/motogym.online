const { GraphQLScalarType } = require('graphql');
const CompetitionResultTimeUtils = require('../../utils/CompetitionResultTime');


const CompetitionResultTime = new GraphQLScalarType({
    name: 'CompetitionResultTime',
    description: 'CompetitionResultTime',
    serialize(value) {
        return CompetitionResultTimeUtils.fromMilliseconds(value).toString();
    },
    parseValue(value) {
        return new CompetitionResultTimeUtils(value.toString()).toMilliseconds();
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            // Implement your own behavior here by returning what suits your needs
            // depending on ast.kind
        }
    }
});

module.exports = {
    CompetitionResultTime
};