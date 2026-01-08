import { Client } from "discord.js";

export class ClientWrapper {

    private readonly _client: Client;

    private _channelId: string | undefined = undefined;

    public constructor(client: Client) {
        this._client = client;
    }

    public client(): Client {
        return this._client;
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