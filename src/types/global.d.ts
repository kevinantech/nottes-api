export {};

declare global {
  type Omit2<T, K extends keyof T> = Omit<T, K>;
}
