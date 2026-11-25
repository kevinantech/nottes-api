import { TransactionContext } from '../../../shared/domain/unit-of-work.interface';
import { IProject } from './project.entity';

export type UpdateProjectPayload = Partial<
  Pick<IProject, 'title' | 'description'>
>;

export interface IProjectRepository {
  deleteById(
    projectId: string,
    tx?: TransactionContext,
  ): Promise<IProject | null>;

  findById(id: string): Promise<IProject | null>;
  findByAuthorId(authorId: string): Promise<IProject[]>;

  /**
   * Reserva de forma atómica un cupo para un nuevo miembro en el proyecto,
   * incrementando el contador mientras no se supere el límite.
   *
   * @param projectId ID del proyecto.
   * @param max Límite máximo de miembros permitidos en el proyecto.
   * @param tx Contexto transaccional (opcional).
   * @returns `true` si se reservó el cupo; `false` si el proyecto alcanzó el límite `max` o no existe.
   */
  reserveMemberSlot(
    projectId: string,
    max: number,
    tx?: TransactionContext,
  ): Promise<boolean>;

  /**
   * Libera de forma atómica un cupo de miembro en el proyecto,
   * decrementando el contador actual (sin bajar de cero).
   *
   * @param projectId ID del proyecto.
   * @param tx Contexto transaccional (opcional).
   * @returns `true` si se liberó el cupo; `false` si el proyecto no existe o el contador ya estaba en `0`.
   */
  releaseMemberSlot(
    projectId: string,
    tx?: TransactionContext,
  ): Promise<boolean>;

  save(project: IProject, tx: TransactionContext): Promise<IProject>;

  updateById(
    id: string,
    payload: UpdateProjectPayload,
  ): Promise<IProject | null>;
}

