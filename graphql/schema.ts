import 'graphql-import-node';
// import * as typeDefs from './graphql/schema.graphql';
const typeDefs = require('./typeDef');
import {makeExecutableSchema} from 'graphql-tools';
const resolvers = require('./resolvers');
import {GraphQLSchema} from 'graphql';

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;