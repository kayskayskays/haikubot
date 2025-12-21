import { CommandInteraction, RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord.js";
import { CommandRegistry } from "./CommandRegistry.js";

export abstract class Command<T extends CommandInteraction> {

    abstract execute(interaction: T): Promise<void>;

    abstract data(): RESTPostAPIContextMenuApplicationCommandsJSONBody;

    abstract name(): string;

    public register(): void {
        CommandRegistry.registerCommand(this);
    }

}