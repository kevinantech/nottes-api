import { IProject } from './project.entity';

export interface ProjectRepository {
  findProjectById(id: string): Promise<IProject | null>;
  findProjectsByAuthorId(authorId: string): Promise<IProject[]>;
  registerProject(Project: IProject): Promise<IProject | void>;
  updateProject(id: string, name: string): Promise<IProject | null>;
  deleteProject(id: string): Promise<IProject | null>;
}
