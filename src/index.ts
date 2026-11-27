import 'reflect-metadata'; // No remover, el contenedor de dependencias depende de él.
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { validateToken } from './apollo/context';
import formatError from './apollo/formatError';
import { errorHttpStatusPlugin, errorLoggerPlugin } from './apollo/plugin';
import schema from './apollo/schema';
import { connectDatabase } from './config/database';
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

/**
 * Getting Started
 * https://www.apollographql.com/docs/apollo-server/getting-started
 */
const bootstrap = async () => {
  connectDatabase();
  const server = new ApolloServer({
    schema,
    plugins: [errorHttpStatusPlugin, errorLoggerPlugin],
    formatError,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.APP_PORT ?? '4000') },
    context: async ({ req }) => ({
      user: validateToken(req.headers.authorization),
    }),
  });
  console.log(`🚀  Server ready at: ${url}`);
};
bootstrap();

