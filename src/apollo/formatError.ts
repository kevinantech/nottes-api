import { ApolloServerOptions, BaseContext } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { AppException } from '../core/shared/domain/exception';
import { ApolloServerErrorCode } from '@apollo/server/errors';

/**
 * Filtro de errores.
 * https://www.apollographql.com/docs/apollo-server/data/errors#masking-and-logging-errors
 * https://www.apollographql.com/docs/apollo-server/data/errors#built-in-error-codes
 */
const formatError: ApolloServerOptions<BaseContext>['formatError'] = (
  formattedError,
  error,
) => {
  // Error de negocio esperado
  if (error instanceof GraphQLError && error.cause instanceof AppException) {
    return error.cause.toResponse();
  }

  // Error inesperado
  if (
    formattedError.extensions?.code ===
    ApolloServerErrorCode.INTERNAL_SERVER_ERROR
  ) {
    return { message: 'Error interno del servidor' };
  }

  return formattedError;
};

export default formatError;
