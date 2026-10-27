import { TaskService } from '../application/task.uc';

export class TaskResolver {
  constructor(private taskUseCases: TaskService) {
    this.getTasks = this.getTasks.bind(this);
    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  public async getTasks(_parent: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Autorización denegada');
    return await this.taskUseCases.findByProject(
      input.projectId,
      context.authorization.ID,
    );
  }

  public async createTask(_parent: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Autorización denegada');
    return await this.taskUseCases.create(
      {
        title: input.title,
        projectId: input.projectId,
      },
      context.authorization.ID,
    );
  }

  public async updateTask(_parent: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Autorización denegada');
    return await this.taskUseCases.update(
      {
        ...(input.title ? { title: input.title } : {}),
        ...(input.status ? { status: input.status } : {}),
        ...(input.projectId ? { projectId: input.projectId } : {}),
      },
      input.id,
      context.authorization.ID,
    );
  }

  public async deleteTask(_parent: any, { id }: any, context: any) {
    if (!context.authorization) throw new Error('Autorización denegada');
    return await this.taskUseCases.delete(id, context.authorization.ID);
  }
}

