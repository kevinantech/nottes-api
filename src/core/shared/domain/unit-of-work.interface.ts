export type TransactionContext = {
  // Agrega seguridad a la arquitectura y previene errores en desarrollo.
  readonly __brand: 'TransactionContext';
};

export interface IUnitOfWork {
  run<T>(work: (tx: TransactionContext) => Promise<T>): Promise<T>;
}
