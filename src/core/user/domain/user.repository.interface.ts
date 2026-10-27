import { TransactionContext } from '../../shared/domain/unit-of-work.interface';
import { IUser } from './user.entity';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;

  findByEmail(email: string): Promise<IUser | null>;

  updateById(
    id: string,
    payload: Omit2<Partial<IUser>, 'id'>,
    projection?: Partial<Record<keyof IUser, boolean>>,
  ): Promise<IUser | null>;
  save(user: IUser): Promise<void>;

  /**
   * Incrementa el contador de proyectos mientras este sea inferior al límite máximo.
   */
  reserveOwnedProjectSlot(
    userId: string,
    max: number,
    tx?: TransactionContext,
  ): Promise<boolean>;
}

