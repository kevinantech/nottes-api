import { container } from 'tsyringe';
import { UserRepository } from '../core/user/infrastructure/user.repository';
import { ProjectRepository } from '../core/project/infrastructure/project/project.repository';
import { ProjectMemberRepository } from '../core/project/infrastructure/member/member.repository';
import { MongoUnitOfWork } from '../core/shared/infrastructure/mongo-unit-of-work';

container.registerSingleton('IUserRepository', UserRepository);
container.registerSingleton('IProjectRepository', ProjectRepository);
container.registerSingleton(
  'IProjectMemberRepository',
  ProjectMemberRepository,
);
container.registerSingleton('IUnitOfWork', MongoUnitOfWork);

export { container };
