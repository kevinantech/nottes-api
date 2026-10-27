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
  reserveMemberSlot(
    projectId: string,
    max: number,
    tx?: TransactionContext,
  ): Promise<boolean>;
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

