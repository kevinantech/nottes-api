import { UCProject } from '../application/project.usecases';

export class ProjectResolver {
  constructor(private projectUseCases: UCProject) {
    this.GetProjects = this.GetProjects.bind(this);
    this.Create = this.Create.bind(this);
    this.Update = this.Update.bind(this);
    this.Delete = this.Delete.bind(this);
  }

  public async GetProjects(_: any, __: any, context: any) {
    if (!context.authorization) throw new Error('Authorization denied');
    const authorId: string = context.authorization.ID;
    const data = await this.projectUseCases.GetProjects(authorId);
    return data;
  }

  public async Create(_: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Authorization denied');
    const body = {
      name: input.name,
      authorId: context.authorization.ID,
    };
    const data = await this.projectUseCases.Create(body.name, body.authorId);
    return data;
  }

  public async Update(_: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Authorization denied');
    const body = {
      id: input.id,
      name: input.name,
      editorId: context.authorization.ID,
    };
    const data = await this.projectUseCases.Update(
      body.id,
      body.name,
      body.editorId,
    );
    return data;
  }

  public async Delete(_: any, { id }: any, context: any) {
    if (!context.authorization) throw new Error('Authorization denied');
    const body = {
      id: id,
      editorId: context.authorization.ID,
    };
    const data = await this.projectUseCases.Delete(body.id, body.editorId);
    return data;
  }
}

