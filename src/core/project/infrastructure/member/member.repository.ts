import { Injectable } from '../../../../di';
import { TransactionContext } from '../../../shared/domain/unit-of-work.interface';
import { toSession } from '../../../shared/infrastructure/mongo-unit-of-work';
import { IMember } from '../../domain/member/member.entity';
import { IProjectMemberRepository } from '../../domain/member/member.repository.interface';
import { MemberRole } from '../../domain/member/member-role.enum';
import { MemberModel } from './member.model';

@Injectable()
export class ProjectMemberRepository implements IProjectMemberRepository {
  async findByProjectId(projectId: string): Promise<IMember[]> {
    return await MemberModel.find({ projectId }).lean().exec();
  }

  async findByProjectAndUser(
    projectId: string,
    userId: string,
  ): Promise<IMember | null> {
    return await MemberModel.findOne({ projectId, userId }).lean().exec();
  }

  async findByUserId(userId: string): Promise<IMember[]> {
    return await MemberModel.find({ userId }).lean().exec();
  }

  async save(member: IMember, tx: TransactionContext): Promise<IMember> {
    const session = toSession(tx);
    const [result] = await MemberModel.create([member], { session });
    return result;
  }

  async updateRole(
    projectId: string,
    userId: string,
    role: MemberRole,
    tx?: TransactionContext,
  ): Promise<IMember | null> {
    return await MemberModel.findOneAndUpdate(
      { projectId, userId },
      { $set: { role } },
      { new: true, session: toSession(tx) },
    )
      .lean()
      .exec();
  }

  async delete(
    projectId: string,
    userId: string,
    tx?: TransactionContext,
  ): Promise<IMember | null> {
    return await MemberModel.findOneAndDelete(
      { projectId, userId },
      { session: toSession(tx) },
    )
      .lean()
      .exec();
  }

  async deleteByProjectId(
    projectId: string,
    tx?: TransactionContext,
  ): Promise<void> {
    await MemberModel.deleteMany(
      { projectId },
      { session: toSession(tx) },
    ).exec();
  }
}

