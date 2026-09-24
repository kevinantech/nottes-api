import { IUser } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { UserModel } from './user.model';

export class UserDatabaseRepository implements UserRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    const userFound = await UserModel.findOne({ email });
    return userFound;
  }

  async registerUser(user: IUser): Promise<void> {
    try {
      await new UserModel(user).save();
    } catch (e) {
      // TODO: Add logger.
      console.error({ at: `${__dirname}, => registerUser`, error: e });
    }
  }
}

