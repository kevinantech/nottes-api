import { IUser } from './user.entity';

export interface UserRepository {
  findUserByEmail(email: string): Promise<IUser | null>;
  registerUser(user: IUser): Promise<void>;
}

