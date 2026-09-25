import { IProject } from './project.entity';

export type UpdateProjectPayload = Pick<IProject, 'title'>;

export interface IProjectRepository {
  findById(id: string): Promise<IProject | null>;
  findByAuthorId(authorId: string): Promise<IProject[]>;
  save(Project: IProject): Promise<IProject>;
  updateById(
    id: string,
    payload: UpdateProjectPayload,
  ): Promise<IProject | null>;
  deleteById(id: string): Promise<IProject | null>;
}

