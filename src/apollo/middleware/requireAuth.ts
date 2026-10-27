import { AppException } from '../../core/shared/domain/exception';
import type { ResolverFn } from '../../types/__generated__/graphql';
import type { Context, UserPayload } from '../context';

type AuthedContext = Context & { user: UserPayload };

export function requireAuth<
  TResult,
  TParent = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
>(
  resolverFn: ResolverFn<TResult, TParent, AuthedContext, TArgs>,
): ResolverFn<TResult, TParent, Context, TArgs> {
  return async (parent, args, context, info) => {
    if (!context.user) throw new AppException('Requiere autenticación', 401);
    return resolverFn(parent, args, context as AuthedContext, info);
  };
}
