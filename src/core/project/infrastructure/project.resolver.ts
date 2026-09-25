import { ProjectService } from '../application/project.uc';

export class ProjectResolver {
  constructor(private projectUseCases: ProjectService) {
    this.getProjects = this.getProjects.bind(this);
    this.createProject = this.createProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  public async getProjects(_parent: any, _args: any, context: any) {
    if (!context.authorization) throw new Error('Autorización denegada');
    return await this.projectUseCases.findByAuthor(context.authorization.ID);
  }

  public async createProject(_parent: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Autorización denegada');
    return await this.projectUseCases.create(
      { title: input.title },
      context.authorization.ID,
    );
  }

  public async updateProject(_parent: any, { input }: any, context: any) {
    if (!context.authorization) throw new Error('Autorización denegada');
    return await this.projectUseCases.update(
      { title: input.title },
      input.id,
      context.authorization.ID,
    );
  }

  public async deleteProject(_parent: any, { id }: any, context: any) {
    if (!context.authorization) throw new Error('Autorización denegada');
    return await this.projectUseCases.delete(id, context.authorization.ID);
  }
}

