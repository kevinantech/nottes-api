import { Injectable } from '../../../di';
import { TransactionContext } from '../../shared/domain/unit-of-work.interface';
import { toSession } from '../../shared/infrastructure/mongo-unit-of-work';
import { IUser } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { UserModel } from './user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findOne({ id }).lean().exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).lean().exec();
  }

  async updateById(
    id: string,
    payload: Omit2<Partial<IUser>, 'id'>,
    projection?: Partial<Record<keyof IUser, boolean>>,
  ): Promise<IUser | null> {
    const result = await UserModel.findOneAndUpdate(
      { id },
      { $set: payload },
      { returnDocument: 'after', projection },
    )
      .lean()
      .exec();
    return result;
  }

  async save(user: IUser): Promise<void> {
    await new UserModel(user).save();
  }

  async reserveOwnedProjectSlot(
    userId: string,
    max: number,
    tx?: TransactionContext,
  ): Promise<boolean> {
    const { modifiedCount } = await UserModel.updateOne(
      { id: userId, projectCount: { $lt: max } }, // lt (less than), similar al filtro de drizzle.
      { $inc: { projectCount: 1 } },
      { session: toSession(tx) },
    );
    return modifiedCount === 1;
  }
}

