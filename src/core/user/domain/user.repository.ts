import { IUser } from './user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(user: IUser): Promise<void>;
}

