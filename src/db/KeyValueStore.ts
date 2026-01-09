
export interface KeyValueStore {

    get(key: string): number | null;

    set(key: string, value: number): void;

    unset(key: string): void;

}

export namespace KeyValueStore {
    export const STORE_NAME: string = "syllables.db";
}