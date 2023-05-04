import {GraphQLScalarType} from 'graphql';
import {CompetitionResultTime as CompetitionResultTimeUtils} from '../../utils/CompetitionResultTime.js';

export const CompetitionResultTime = new GraphQLScalarType({
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
