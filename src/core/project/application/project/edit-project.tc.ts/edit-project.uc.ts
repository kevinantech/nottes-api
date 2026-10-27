import z from 'zod';
import { Inject, Injectable } from '../../../../../di';
import {
  AppException,
  ValidationException,
} from '../../../../shared/domain/exception';
import { IProjectResponse } from '../../../domain/project/project.entity';
import { ProjectMapper } from '../project.mapper';
import { IProjectRepository } from '../../../domain/project/project.repository';
import { UpdateProjectInput, UpdateProjectSchema } from './edit-project.schema';

/**
 * Restricciones:
 *  - Solo el owner puede editar el proyecto.
 */
@Injectable()
export class EditProjectService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(
    id: string,
    raw: UpdateProjectInput,
    ownerId: string,
  ): Promise<IProjectResponse> {
    const { data: input, error } = z.safeParse(UpdateProjectSchema, raw);
    if (error) throw ValidationException.fromZod(error);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new AppException('Proyecto no encontrado');

    if (project.ownerId !== ownerId) {
      throw new AppException('Acción inválida');
    }

    const changes = {};
    for (const [key, value] of Object.entries(input)) {
      if (value) changes[key] = value;
    }

    if (Object.keys(changes).length === 0) {
      throw new AppException('No se proporcionaron campos para actualizar');
    }

    const updatedProject = await this.projectRepository.updateById(id, input);

    return ProjectMapper.toResponse(updatedProject);
  }
}
