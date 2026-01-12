import { Client } from "discord.js";
import { KeyValueStore } from "../db/KeyValueStore.js";

export class ClientWrapper {

    private readonly _client: Client;
    private readonly _kvStoreFactory: ClientWrapper.KvStoreFactory;

    private readonly _idToKvs = new Map<string, KeyValueStore>();

    public constructor(client: Client, kvStoreFactory: ClientWrapper.KvStoreFactory) {
        this._client = client;
        this._kvStoreFactory = kvStoreFactory;
    }

    public client(): Client {
        return this._client;
    }

    public kvStore(guildId: string): KeyValueStore {
        if ( !this._idToKvs.has(guildId) ) {
            this._idToKvs.set(guildId, this._kvStoreFactory(guildId));
        }

        return this._idToKvs.get(guildId)!;
    }

    public async login(token: string): Promise<any> {
        return this._client.login(token);
    }

}

export namespace ClientWrapper {
    export type KvStoreFactory = (guildId: string) => KeyValueStore;
}