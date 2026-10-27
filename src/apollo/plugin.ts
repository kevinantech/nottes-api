import { ApolloServerPlugin } from '@apollo/server';
import { GraphQLError } from 'graphql/error';
import { AppException } from '../core/shared/domain/exception';
import Logger from '../config/logger';

/**
 * Si hay una AppException, usa su statusCode como código HTTP de la respuesta.
 * https://www.apollographql.com/docs/apollo-server/integrations/plugins-event-reference#requestdidstart
 * https://www.apollographql.com/docs/apollo-server/integrations/plugins-event-reference#willsendresponse
 */
export const errorHttpStatusPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response, errors }) {
        const error = errors?.find(
          (e) => e instanceof GraphQLError && e.cause instanceof AppException,
        ) as GraphQLError & { cause: AppException };

        if (error) {
          response.http.status = error.cause.statusCode;
        }
      },
    };
  },
};

/**
 * Registra todos los errores.
 */
export const errorLoggerPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors({ errors }) {
        for (const err of errors) {
          Logger.error({
            message: err.message,
            code: err.extensions?.code,
            path: err.path,
          });
        }
      },
    };
  },
};
