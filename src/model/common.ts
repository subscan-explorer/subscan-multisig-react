export interface Action<U, T = string> {
  type: U;
  payload: T;
}

export type Config<T extends string, U> = { [key in T]: U };

export type Assets = 'ring' | 'kton';

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
