import { ApolloServer } from '@apollo/server';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql/error';
import { verifyToken } from './apollo/context.values';
import { errorStatusPlugin } from './apollo/plugins';
import { resolvers } from './apollo/resolvers';
import { typeDefs } from './apollo/types';
import { connectDatabase } from './config/database';
import { AppException } from './config/exception';
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
    typeDefs,
    resolvers,
    plugins: [errorStatusPlugin],

    /**
     * Filtro de errores.
     * https://www.apollographql.com/docs/apollo-server/data/errors#masking-and-logging-errors
     * https://www.apollographql.com/docs/apollo-server/data/errors#built-in-error-codes
     */
    formatError: (formattedError, error) => {
      // Error de negocio esperado
      if (
        error instanceof GraphQLError &&
        error.cause instanceof AppException
      ) {
        return error.cause.toResponse();
      }

      // Error inesperado
      if (
        formattedError.extensions?.code ===
        ApolloServerErrorCode.INTERNAL_SERVER_ERROR
      ) {
        // TODO: Reemplazar console.error por el Logger.
        console.error(error);
        return { message: 'Error interno del servidor' };
      }

      return formattedError;
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.APP_PORT ?? '4000') },
    context: async ({ req }) => ({
      authorization: verifyToken(req.headers.authorization),
    }),
  });
  console.log(`🚀  Server ready at: ${url}`);
};
bootstrap();

