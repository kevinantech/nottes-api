import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/types';
import { verifyToken } from './graphql/context.values';
import { connectDatabase } from './config/database';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.APP_PORT) {
  throw new Error('APP_PORT no está definido en las variables de entorno');
}

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI no está definido en las variables de entorno');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

const bootstrap = async () => {
  connectDatabase();
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.APP_PORT ?? '4000') },
    context: async ({ req }) => ({
      authorization: verifyToken(req.headers.authorization),
    }),
  });
  console.log(`🚀  Server ready at: ${url}`);
};
bootstrap();

