const { GraphQLScalarType } = require('graphql');

const LocalizedString = new GraphQLScalarType({
    name: 'LocalizedString',
    description: 'LocalizedString',
    serialize(value) {
        return '';
    }
});

module.exports = {
    LocalizedString
};