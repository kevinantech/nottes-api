import {
  IProject,
  IProjectResponse,
} from '../../domain/project/project.entity';

export class ProjectMapper {
  public static toResponse(entity: IProject): IProjectResponse {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
