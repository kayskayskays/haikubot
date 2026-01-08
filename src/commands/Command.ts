import { CommandInteraction } from "discord.js";
import { ClientWrapper } from "../ClientWrapper";
import { CommandRegistry } from "./CommandRegistry";

export abstract class Command<T extends CommandInteraction> {

    private _cw: ClientWrapper | undefined;

    public constructor() {
        CommandRegistry.registerCommand(this);
    }

    public setClientWrapper(cw: ClientWrapper): void {
        this._cw = cw;
    }

    protected clientWrapper(): ClientWrapper | undefined {
        return this._cw;
    }

    abstract execute(interaction: T): Promise<void>;

    abstract data(): any;

    abstract name(): string;

}