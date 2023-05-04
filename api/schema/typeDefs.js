import {readFileSync} from 'fs';
const filePath = new URL('types.graphql', import.meta.url);
export const typeDefs = readFileSync(filePath).toString('utf-8');
