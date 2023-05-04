import { GraphQLScalarType } from 'graphql';

export const LocalizedDescription = new GraphQLScalarType({
    name: 'LocalizedDescription',
    description: 'LocalizedDescription',
    serialize(value) {
        return '';
    }
});
