import { ApplicationCommandDataResolvable, CommandInteraction } from "discord.js";
import { ClientWrapper } from "../client/ClientWrapper";

export abstract class Command<T extends CommandInteraction> {

    private _cw: ClientWrapper | undefined;

    public setClientWrapper(cw: ClientWrapper): void {
        this._cw = cw;
    }

    protected clientWrapper(): ClientWrapper | undefined {
        return this._cw;
    }

    abstract execute(interaction: T): Promise<void>;

    abstract data(): ApplicationCommandDataResolvable;

    abstract name(): string;

}