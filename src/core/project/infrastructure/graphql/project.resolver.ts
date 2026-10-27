import { container } from 'tsyringe';
import { Resolvers } from '../../../../types/__generated__/graphql';
import { CreateProjectService } from '../../application/project/create-project/create-project.uc';
import { EditProjectService } from '../../application/project/edit-project.tc.ts/edit-project.uc';
import { requireAuth } from '../../../../apollo/middleware/requireAuth';

const createProjectService = container.resolve(CreateProjectService);
const editProjectService = container.resolve(EditProjectService);

const resolver: Resolvers = {
  Mutation: {
    createProject: requireAuth((parent, args, context) => {
      return createProjectService.execute(args, context.user.id);
    }),
    editProject: requireAuth((parent, args, context) => {
      return editProjectService.execute(args.id, args, context.user.id);
    }),
  },
};

export default resolver;

