import { UserDatabaseRepository } from '../core/user/infrastructure/user.database';
// import { ProjectDatabaseRepository } from '../core/project/infrastructure/project.database';
// import { TaskDatabaseRepository } from '../core/task/infrastructure/task.database';
import { UserService } from '../core/user/application/user.uc';
// import { UCProject } from '../core/project/application/project.usecases';
// import { UCTask } from '../core/task/application/task.usecases';
import { UserResolver } from '../core/user/infrastructure/user.resolver';
// import { ProjectResolver } from '../core/project/infrastructure/project.resolver';
// import { TaskResolver } from '../core/task/infrastructure/task.resolver';

// User
const userRepository = new UserDatabaseRepository();
const userUseCases = new UserService(userRepository);
const userResolver = new UserResolver(userUseCases);

// const projectRepo = new ProjectDatabaseRepository();
// const taskRepo = new TaskDatabaseRepository();

// Use cases
// const projectUseCases = new UCProject(projectRepo, taskRepo);
//const taskUseCases = new UCTask(taskRepo, projectRepo);

// Resolvers
// const projectResolver = new ProjectResolver(projectUseCases);
// const taskResolver = new TaskResolver(taskUseCases);

const resolvers = {
  Query: {
    getUsers: async (_parent: any, _args: any) => [],
    // PROJECT
    // GetProjects: projectResolver.GetProjects,
    // TASK
    //GetTasks: taskResolver.GetTasks,
  },
  Mutation: {
    // User
    registerUser: userResolver.register,
    login: userResolver.login,

    // PROJECT
    // CreateProject: projectResolver.Create,
    // UpdateProject: projectResolver.Update,
    // DeleteProject: projectResolver.Delete,

    // TASK
    // CreateTask: taskResolver.Create,
    // UpdateTask: taskResolver.Update,
    // DeleteTask: taskResolver.Delete,
  },
};
export { resolvers };

