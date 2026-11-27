import { container } from 'tsyringe';
import { UserRepository } from '../core/user/infrastructure/user.repository';
import { ProjectRepository } from '../core/project/infrastructure/project/project.repository';
import { MemberRepository } from '../core/project/infrastructure/member/member.repository';
import { ProjectAccessService } from '../core/project/application/project/project-access.service';
import { MongoUnitOfWork } from '../core/shared/infrastructure/mongo-unit-of-work';

container.registerSingleton('IUserRepository', UserRepository);
container.registerSingleton('IProjectRepository', ProjectRepository);
container.registerSingleton('IMemberRepository', MemberRepository);
container.registerSingleton('ProjectAccessService', ProjectAccessService);
container.registerSingleton('IUnitOfWork', MongoUnitOfWork);

export { container };
