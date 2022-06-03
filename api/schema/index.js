const { gql } = require('apollo-server-express');
const { readFileSync } = require('fs');

const typeDefs = readFileSync('./schema/types.graphql', 'UTF-8');

module.exports = gql(typeDefs);