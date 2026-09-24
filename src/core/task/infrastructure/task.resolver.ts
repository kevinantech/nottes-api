import { UCTask } from '../application/task.usecases';

export class TaskResolver {
  constructor(private taskUseCases: UCTask) {
    this.GetTasks = this.GetTasks.bind(this);
    this.Create = this.Create.bind(this);
    this.Update = this.Update.bind(this);
    this.Delete = this.Delete.bind(this);
  }

  public async GetTasks(_: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Authorization denied');
    const body = {
      projectId: input.projectId,
      userId: context.authorization.ID,
    };
    const data = this.taskUseCases.GetTasks(body.projectId, body.userId);
    return data;
  }

  public async Create(_: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Authorization denied');
    const body = {
      name: input.name,
      projectId: input.projectId,
      authorId: context.authorization.ID,
    };
    const data = await this.taskUseCases.Create(
      body.name,
      body.projectId,
      body.authorId,
    );
    return data;
  }

  public async Update(_: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Authorization denied');
    const body = {
      ID: input.ID,
      name: input.name,
      status: input.status,
      editorId: context.authorization.ID,
    };
    const data = await this.taskUseCases.Update(
      body.ID,
      body.editorId,
      body.name,
      body.status,
    );
    return data;
  }

  public async Delete(_: any, { ID }: any, context: any) {
    if (!context.authorization) throw new Error('Authorization denied');
    const body = {
      ID: ID,
      editorId: context.authorization.ID,
    };
    const data = await this.taskUseCases.Delete(body.ID, body.editorId);
    return data;
  }
}
