import { requireAuth } from '../../../../apollo/middleware/requireAuth';
import { Resolvers } from '../../../../types/__generated__/graphql';
import { UserService } from '../../application/user.uc';
import { container } from '../../../../di/container';

const service = container.resolve(UserService);

const resolver: Resolvers = {
  Query: {
    me: requireAuth((parent, args, context) => {
      return service.getProfile(context.user.id);
    }),
  },
  Mutation: {
    loginUser: (parent, args) => service.login(args),

    registerUser: async (parent, args) => {
      await service.register(args);
      return { success: true };
    },

    updateProfile: requireAuth((parent, args, context) => {
      return service.updateProfile(context.user.id, args);
    }),
  },
};

export default resolver;

