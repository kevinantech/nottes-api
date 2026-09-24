import { ProjectRepository } from '../domain/project.repository';
import { ProjectModel } from './project.model';
import { IProject } from '../domain/project.entity';

export class ProjectDatabaseRepository implements ProjectRepository {
  async findProjectById(id: string): Promise<IProject | null> {
    const project = await ProjectModel.findOne({ id });
    return project;
  }

  async findProjectsByAuthorId(authorId: string): Promise<IProject[]> {
    const projects = await ProjectModel.find({ authorId });
    return projects;
  }

  async registerProject(project: IProject): Promise<IProject | void> {
    try {
      const projectModel = new ProjectModel(project);
      const savedProject = await projectModel.save();
      return savedProject;
    } catch (e) {
      console.error({ at: `${__dirname} => registerProject`, message: e });
    }
  }

  async updateProject(id: string, name: string): Promise<IProject | null> {
    const updatedProject = await ProjectModel.findOneAndUpdate(
      { id },
      { name },
      { new: true },
    );
    return updatedProject;
  }

  async deleteProject(id: string): Promise<IProject | null> {
    const deletedProject = await ProjectModel.findOneAndDelete({ id });
    return deletedProject;
  }
}

