import { IUser } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository';
import { UserModel } from './user.model';

export class UserDatabaseRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).lean();
  }

  async save(user: IUser): Promise<void> {
    await new UserModel(user).save();
  }
}

