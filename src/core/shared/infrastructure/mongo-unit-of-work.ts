import mongoose, { ClientSession } from 'mongoose';
import {
  IUnitOfWork,
  TransactionContext,
} from '../domain/unit-of-work.interface';
import { Injectable } from '../../../di';

// Convierte el contexto opaco a sesión de Mongoose
export const toSession = (tx?: TransactionContext) =>
  tx as unknown as ClientSession | undefined;

@Injectable()
export class MongoUnitOfWork implements IUnitOfWork {
  async run<T>(work: (tx: TransactionContext) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();
    try {
      let result: T;
      await session.withTransaction(async () => {
        result = await work(session as unknown as TransactionContext);
      });
      return result;
    } finally {
      await session.endSession();
    }
  }
}
