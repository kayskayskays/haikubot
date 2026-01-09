import { Client } from "discord.js";
import { KeyValueStore } from "../db/KeyValueStore.js";

export class ClientWrapper {

    private readonly _client: Client;

    private _channelId: string | undefined = undefined;
    private readonly _kvStoreFactory: ClientWrapper.KvStoreFactory;

    public constructor(client: Client, kvStoreFactory: ClientWrapper.KvStoreFactory) {
        this._client = client;
        this._kvStoreFactory = kvStoreFactory;
    }

    public client(): Client {
        return this._client;
    }

    public kvStore(guildId: string): KeyValueStore {
        return this._kvStoreFactory(guildId);
    }

    public writeableChannelId(): string | undefined {
        return this._channelId;
    }

    public setWriteableChannelId(channelId: string) : void {
        this._channelId = channelId;
    }

    public async login(token: string): Promise<any> {
        return this._client.login(token);
    }

}

export namespace ClientWrapper {
    export type KvStoreFactory = (guildId: string) => KeyValueStore;
}