import { ApolloServerPlugin } from '@apollo/server';
import { GraphQLError } from 'graphql/error';
import { AppException } from '../config/exception';

/**
 * Si hay una AppException, usa su statusCode como código HTTP de la respuesta.
 * https://www.apollographql.com/docs/apollo-server/integrations/plugins-event-reference#requestdidstart
 * https://www.apollographql.com/docs/apollo-server/integrations/plugins-event-reference#willsendresponse
 */
export const errorStatusPlugin: ApolloServerPlugin = {
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
