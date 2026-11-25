import { Inject, Injectable } from '../../../../di';
import { AppException } from '../../../shared/domain/exception';
import { IMember } from '../../domain/member/member.entity';
import { IMemberRepository } from '../../domain/member/member.repository.interface';
import {
  ProjectAccessPolicy,
  ProjectPermission,
} from './project-access.policy';
import { IProject } from '../../domain/project/project.entity';
import { IProjectRepository } from '../../domain/project/project.repository.interface';

type ProjectAccess = {
  project: IProject;
  actor: IMember;
};

@Injectable()
export class ProjectAccessService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
    @Inject('IMemberRepository')
    private readonly memberRepository: IMemberRepository,
  ) {}

  /**
   * Verifica que el miembro que ejecuta la acción sea miembro del proyecto.
   * @param projectId ID del proyecto
   * @param actorId ID del usuario que ejecuta la acción
   * @returns Proyecto y miembro (actor)
   * @throws AppException 404 si el proyecto no existe
   * @throws AppException 403 si el actor no pertenece al proyecto
   */
  async ensureMembership(
    projectId: string,
    actorId: string,
  ): Promise<ProjectAccess> {
    /**
     * Si hacemos las dos consultas de forma secuencial (`await` tras `await`),
     * le estamos metiendo doble latencia de red a casi todos nuestros usuarios
     * válidos solo para ahorrar una búsqueda indexada muy barata en el 1% de
     * peticiones que traen un ID inexistente
     */
    const [project, actor] = await Promise.all([
      this.projectRepository.findById(projectId),
      this.memberRepository.findByProjectAndUser(projectId, actorId),
    ]);

    if (!project) throw new AppException('Proyecto no encontrado', 404);
    if (!actor) throw new AppException('No tienes acceso a este proyecto', 403);

    return { project, actor };
  }

  /**
   * Verifica que el actor tenga el permiso requerido para el proyecto.
   * @param projectId ID del proyecto
   * @param actorId ID del usuario que ejecuta la acción
   * @param permission Permiso que se desea verificar
   * @throws AppException 404 si el proyecto no existe
   * @throws AppException 403 si el actor no pertenece al proyecto o no tiene el permiso requerido
   * @returns
   */
  async ensureCan(
    projectId: string,
    actorId: string,
    permission: ProjectPermission,
  ): Promise<ProjectAccess> {
    const access = await this.ensureMembership(projectId, actorId);

    if (!ProjectAccessPolicy.can(access.actor.role, permission)) {
      throw new AppException(
        'No tienes permisos para realizar esta acción',
        403,
      );
    }
    return access;
  }
}

