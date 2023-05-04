import {GraphQLScalarType} from 'graphql';
import {parseCompetitionName} from "../../utils/parseCompetitionName.js";

export const CompetitionName = new GraphQLScalarType({
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
