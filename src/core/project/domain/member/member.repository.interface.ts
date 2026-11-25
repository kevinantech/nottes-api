import { TransactionContext } from '../../../shared/domain/unit-of-work.interface';
import { IMember } from './member.entity';
import { MemberRole } from './member-role.enum';

export interface IMemberRepository {
  findByProjectId(projectId: string): Promise<IMember[]>;
  findByProjectAndUser(
    projectId: string,
    userId: string,
  ): Promise<IMember | null>;
  findByUserId(userId: string): Promise<IMember[]>;
  save(member: IMember, tx: TransactionContext): Promise<IMember>;
  updateRole(
    projectId: string,
    userId: string,
    role: MemberRole,
    tx?: TransactionContext,
  ): Promise<IMember | null>;
  delete(
    projectId: string,
    userId: string,
    tx?: TransactionContext,
  ): Promise<IMember | null>;
  deleteByProjectId(projectId: string, tx?: TransactionContext): Promise<void>;
}

