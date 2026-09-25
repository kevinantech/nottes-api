import { z } from 'zod';
import { AppException, ValidationException } from '../../../config/exception';
import { ITaskRepository } from '../../task/domain/task.repository';
import { IProject, IProjectResponse } from '../domain/project.entity';
import { IProjectRepository } from '../domain/project.repository';
import {
  CreateProjectInput,
  CreateProjectInputSchema,
  UpdateProjectInput,
  UpdateProjectInputSchema,
} from '../domain/project.schema';
import Project from '../domain/project.value';

export class ProjectService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly taskRepository: ITaskRepository,
  ) {}

  // TODO: Añadir paginación.
  public async findByAuthor(authorId: string): Promise<IProjectResponse[]> {
    return await this.projectRepository.findByAuthorId(authorId);
  }

  public async create(
    raw: CreateProjectInput,
    authorId: string,
  ): Promise<IProjectResponse> {
    const { data: input, error } = z.safeParse(CreateProjectInputSchema, raw);
    if (error) throw ValidationException.fromZod(error);

    const p = await this.projectRepository.save(
      new Project(input.title, authorId),
    );

    return this.toResponse(p);
  }

  public async update(
    raw: UpdateProjectInput,
    projectId: string,
    editorId: string,
  ): Promise<IProjectResponse> {
    const { data: payload, error } = z.safeParse(UpdateProjectInputSchema, raw);
    if (error) throw ValidationException.fromZod(error);

    const p = await this.projectRepository.findById(projectId);
    if (!p || editorId != p.authorId) {
      throw new AppException('Proyecto no encontrado', 404 /* Not Found */);
    }

    const updated = await this.projectRepository.updateById(projectId, payload);
    // Intentional Error over AppException, is an unexpected error.
    if (!updated) throw new Error('No se pudo actualizar el proyecto');

    return this.toResponse(updated);
  }

  public async delete(id: string, editorId: string): Promise<IProjectResponse> {
    const p = await this.projectRepository.findById(id);
    if (!p || editorId != p.authorId) {
      throw new AppException('Proyecto no encontrado', 404 /* Not Found */);
    }

    await this.taskRepository.deleteByProjectId(id);

    const deleted = await this.projectRepository.deleteById(id);
    // Intentional Error over AppException, is an unexpected error.
    if (!deleted) throw new Error('No se pudo eliminar el proyecto');

    return this.toResponse(deleted);
  }

  private toResponse(entity: IProject): IProjectResponse {
    return {
      id: entity.id,
      title: entity.title,
      created: entity.created,
    };
  }
}

