import 'graphql-import-node';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  resolver as userResolver,
  typeDef as userTypeDef,
} from '../core/user/infrastructure/graphql';

const schema = makeExecutableSchema({
  resolvers: [userResolver],
  typeDefs: [userTypeDef],
});

export default schema;
