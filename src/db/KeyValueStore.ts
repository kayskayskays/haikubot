
export interface KeyValueStore {

    get(key: string): string | null;

    set(key: string, value: string): void;

    unset(key: string): void;

}

export namespace KeyValueStore {
    export const STORE_NAME: string = "syllables.db";
}
