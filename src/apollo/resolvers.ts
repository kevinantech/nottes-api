import { UserDatabaseRepository } from '../core/user/infrastructure/user.database';
import { UserService } from '../core/user/application/user.uc';
import { ProjectDatabaseRepository } from '../core/project/infrastructure/project.database';
import { TaskDatabaseRepository } from '../core/task/infrastructure/task.database';
import { UserResolver } from '../core/user/infrastructure/user.resolver';
import { ProjectService } from '../core/project/application/project.uc';
import { TaskService } from '../core/task/application/task.uc';
import { ProjectResolver } from '../core/project/infrastructure/project.resolver';
import { TaskResolver } from '../core/task/infrastructure/task.resolver';

const userRepository = new UserDatabaseRepository();
const userUseCases = new UserService(userRepository);
const userResolver = new UserResolver(userUseCases);

const taskRepository = new TaskDatabaseRepository();
const projectRepository = new ProjectDatabaseRepository();

const projectUseCases = new ProjectService(projectRepository, taskRepository);
const projectResolver = new ProjectResolver(projectUseCases);

const taskUseCases = new TaskService(taskRepository, projectRepository);
const taskResolver = new TaskResolver(taskUseCases);

const resolvers = {
  Query: {
    getProjects: projectResolver.getProjects,
    getTasks: taskResolver.getTasks,
  },
  Mutation: {
    // User
    registerUser: userResolver.register,
    login: userResolver.login,

    // Project
    createProject: projectResolver.createProject,
    updateProject: projectResolver.updateProject,
    deleteProject: projectResolver.deleteProject,

    // Task
    createTask: taskResolver.createTask,
    updateTask: taskResolver.updateTask,
    deleteTask: taskResolver.deleteTask,
  },
};
export { resolvers };

