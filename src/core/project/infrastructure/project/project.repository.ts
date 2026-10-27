import { Injectable } from '../../../../di';
import { TransactionContext } from '../../../shared/domain/unit-of-work.interface';
import { toSession } from '../../../shared/infrastructure/mongo-unit-of-work';
import { IProject } from '../../domain/project/project.entity';
import {
  IProjectRepository,
  UpdateProjectPayload,
} from '../../domain/project/project.repository';
import { ProjectModel } from './project.model';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  async findById(id: string): Promise<IProject | null> {
    return await ProjectModel.findOne({ id }).lean().exec();
  }

  async findByAuthorId(authorId: string): Promise<IProject[]> {
    return await ProjectModel.find({ ownerId: authorId }).lean().exec();
  }

  async reserveMemberSlot(
    projectId: string,
    max: number,
    tx?: TransactionContext,
  ): Promise<boolean> {
    const { modifiedCount } = await ProjectModel.updateOne(
      { id: projectId, memberCount: { $lt: max } },
      { $inc: { memberCount: 1 } },
      { session: toSession(tx) },
    );
    return modifiedCount === 1;
  }

  async releaseMemberSlot(
    projectId: string,
    tx?: TransactionContext,
  ): Promise<boolean> {
    const { modifiedCount } = await ProjectModel.updateOne(
      { id: projectId, memberCount: { $gt: 0 } },
      { $inc: { memberCount: -1 } },
      { session: toSession(tx) },
    );
    return modifiedCount === 1;
  }

  async save(project: IProject, tx: TransactionContext): Promise<IProject> {
    const session = toSession(tx);

    const [result] = await ProjectModel.create(
      [
        {
          id: project.id,
          title: project.title,
          description: project.description,
          memberCount: project.memberCount,
          ownerId: project.ownerId,
          createdAt: project.createdAt,
        },
      ],
      { session },
    );

    return result.toObject();
  }

  async updateById(
    id: string,
    payload: UpdateProjectPayload,
  ): Promise<IProject | null> {
    return await ProjectModel.findOneAndUpdate(
      { id },
      { ...payload },
      { new: true },
    )
      .lean()
      .exec();
  }

  async deleteById(
    id: string,
    tx?: TransactionContext,
  ): Promise<IProject | null> {
    const session = toSession(tx);
    return await ProjectModel.findOneAndDelete({ id }, { session })
      .lean()
      .exec();
  }
}

