const { readFileSync } = require('fs');

const typeDefs = readFileSync(require.resolve('./types.graphql')).toString('utf-8')

module.exports =  typeDefs;
