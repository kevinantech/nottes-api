import { ProjectRepository } from '../../project/domain/project.repository';
import { TaskRepository } from '../domain/task.repository';
import { Task } from '../domain/task.value';

export class UCTask {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  public async GetTasks(
    projectArg: string,
    userArg: string,
  ): Promise<
    {
      id: string;
      name: string;
      status: boolean;
      projectId: string;
    }[]
  > {
    // Checks that the project exists.
    const projectFound =
      await this.projectRepository.findProjectById(projectArg);
    if (!projectFound) throw new Error('The project does not exist');

    // Checks that the user matches with the author of the project.
    if (userArg != projectFound.authorId)
      throw new Error('You dont have permissions');

    const tasks = await this.taskRepository.findTasksByProjectId(projectArg);
    return tasks;
  }

  public async Create(
    nameArg: string,
    projectArg: string,
    authorArg: string,
  ): Promise<{
    ID: string;
    name: string;
    status: boolean;
    projectId: string;
  }> {
    // Checks that the project exists.
    const projectFound =
      await this.projectRepository.findProjectById(projectArg);
    if (!projectFound) throw new Error('The project does not exist');

    // Checks that the creador of the task matches with the author of the project.
    if (authorArg != projectFound.authorId)
      throw new Error('You dont have permissions');

    const task = new Task(nameArg, projectArg, authorArg);
    const taskCreated = await this.taskRepository.registerTask(task);
    if (!taskCreated) throw new Error('Could not save');
    const { id: ID, name, status, projectId } = taskCreated;
    return { ID, name, status, projectId };
  }

  public async Update(
    idArg: string,
    editorArg: string,
    nameArg?: string,
    statusArg?: boolean,
  ): Promise<{
    id: string;
    name: string;
    status: boolean;
    projectId: string;
  } | null> {
    // Checks that the task exists.
    const taskFound = await this.taskRepository.findTaskById(idArg);
    if (!taskFound) throw new Error('The task does not exist');

    // Checks that the editor matches with the author of the task.
    if (editorArg != taskFound.authorId)
      throw new Error('You dont have permissions');

    const taskUpdated = await this.taskRepository.updateTask(
      idArg,
      nameArg,
      statusArg,
    );
    if (!taskUpdated) throw new Error('Could not update');
    const { id, name, status, projectId } = taskUpdated;
    return { id, name, status, projectId };
  }

  public async Delete(idArg: string, editorArg: string) {
    // Checks that the task exists.
    const taskFound = await this.taskRepository.findTaskById(idArg);
    if (!taskFound) throw new Error('The task does not exist');

    // Checks that the editor matches with the author of the task.
    if (editorArg != taskFound.authorId)
      throw new Error('You dont have permissions');

    const taskUpdated = await this.taskRepository.deleteTask(idArg);
    if (!taskUpdated) throw new Error('Could not update');
    const { id } = taskUpdated;
    return { id };
  }
}

