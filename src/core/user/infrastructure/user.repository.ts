import { Injectable } from '../../../di';
import { toSession } from '../../shared/infrastructure/mongo-unit-of-work';
import { IUser } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { UserModel } from './user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  async save(user: IUser): Promise<void> {
    await new UserModel(user).save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findOne({ id }).lean().exec();
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

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).lean().exec();
  }

  async reserveMembershipSlot(userId, max, tx?) {
    const { modifiedCount } = await UserModel.updateOne(
      { id: userId, membershipCount: { $lt: max } },
      { $inc: { membershipCount: 1 } },
      { session: toSession(tx) },
    );
    return modifiedCount === 1;
  }

  async releaseMembershipSlot(userId, tx?) {
    const { modifiedCount } = await UserModel.updateOne(
      { id: userId, membershipCount: { $gt: 0 } },
      { $inc: { membershipCount: -1 } },
      { session: toSession(tx) },
    );
    return modifiedCount === 1;
  }
}

