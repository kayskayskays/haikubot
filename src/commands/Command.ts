import { ApplicationCommandDataResolvable, CommandInteraction } from "discord.js";
import { ClientWrapper } from "../client/ClientWrapper.js";
import { KeyValueStore } from "../db/KeyValueStore.js";

export abstract class Command<T extends CommandInteraction> {

    private _cw: ClientWrapper | undefined;

    public setClientWrapper(cw: ClientWrapper): void {
        this._cw = cw;
    }

    protected clientWrapper(): ClientWrapper | undefined {
        return this._cw;
    }

    protected keyValueStore(interaction: T): KeyValueStore | undefined {
        const guildId = interaction.guildId;

        if ( !guildId ) {
            console.error("No guildId found.");
            return undefined;
        }

        return this.clientWrapper()?.kvStore(guildId);
    }

    abstract execute(interaction: T): Promise<void>;

    abstract data(): ApplicationCommandDataResolvable;

    abstract name(): string;

}