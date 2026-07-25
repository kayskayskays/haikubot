export interface KeyValueStore {
  get(key: string): string | null;

  set(key: string, value: string): void;

  unset(key: string): void;

  entries(): { key: string; value: string }[];
}

export namespace KeyValueStore {
  export const STORE_NAME: string = 'syllables.db';
}
