import { requireAuth } from '../../../../apollo/middleware/requireAuth';
import { container } from '../../../../di/container';
import { Resolvers } from '../../../../types/__generated__/graphql';
import { GetProfileService } from '../../application/get-profile/get-profile.service';
import { LoginUserUseCase } from '../../application/login/login.uc';
import { RegisterUserUseCase } from '../../application/register/register.uc';
import { UpdateProfileUseCase } from '../../application/update-profile/update-profile.uc';

const service = {
  register: container.resolve(RegisterUserUseCase),
  loginUser: container.resolve(LoginUserUseCase),
  getProfile: container.resolve(GetProfileService),
  updateProfile: container.resolve(UpdateProfileUseCase),
};

const resolver: Resolvers = {
  Query: {
    me: requireAuth((parent, args, context) => {
      return service.getProfile.execute(context.user.id);
    }),
  },
  Mutation: {
    loginUser: (parent, args) => service.loginUser.execute(args),

    registerUser: async (parent, args) => {
      await service.register.execute(args);
      return { success: true };
    },

    updateProfile: requireAuth((parent, args, context) => {
      return service.updateProfile.execute(context.user.id, args);
    }),
  },
};

export default resolver;

