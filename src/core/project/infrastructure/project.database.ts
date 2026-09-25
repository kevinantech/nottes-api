import { IProject } from '../domain/project.entity';
import {
  IProjectRepository,
  UpdateProjectPayload,
} from '../domain/project.repository';
import { ProjectModel, ProjectModelType } from './project.model';

const toEntity = (model: ProjectModelType): IProject => ({
  id: model.id,
  title: model.title,
  created: model.created,
  authorId: model.authorId,
});

export class ProjectDatabaseRepository implements IProjectRepository {
  async findById(id: string): Promise<IProject | null> {
    const p = await ProjectModel.findOne({ id }).lean();
    return p ? toEntity(p) : null;
  }

  async findByAuthorId(authorId: string): Promise<IProject[]> {
    const projects = await ProjectModel.find({ authorId });
    return projects;
  }

  async save(project: IProject): Promise<IProject> {
    return toEntity(await new ProjectModel(project).save());
  }

  async updateById(
    id: string,
    payload: UpdateProjectPayload,
  ): Promise<IProject | null> {
    const p = await ProjectModel.findOneAndUpdate(
      { id },
      { ...payload },
      { new: true },
    ).lean();

    return p ? toEntity(p) : null;
  }

  async deleteById(id: string): Promise<IProject | null> {
    const deletedProject = await ProjectModel.findOneAndDelete({ id });
    return deletedProject;
  }
}

