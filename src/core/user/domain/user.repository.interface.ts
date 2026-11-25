import { TransactionContext } from '../../shared/domain/unit-of-work.interface';
import { IUser } from './user.entity';

export interface IUserRepository {
  save(user: IUser): Promise<void>;

  findById(id: string): Promise<IUser | null>;

  updateById(
    id: string,
    payload: Omit2<Partial<IUser>, 'id'>,
    projection?: Partial<Record<keyof IUser, boolean>>,
  ): Promise<IUser | null>;

  findByEmail(email: string): Promise<IUser | null>;

  reserveMembershipSlot(
    userId: string,
    max: number,
    tx?: TransactionContext,
  ): Promise<boolean>;

  releaseMembershipSlot(
    userId: string,
    tx?: TransactionContext,
  ): Promise<boolean>;
}

