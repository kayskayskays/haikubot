import { Command } from "./Command.js";
import { CommandInteraction, REST, Routes } from "discord.js";
import { CmdCountSyllables } from "./CmdCountSyllables.js";
import { CmdCountSyllablesPerWord } from "./CmdCountSyllablesPerWord.js";
import { CmdSetWriteableChannel } from "./CmdSetWriteableChannel";
import { ClientWrapper } from "../ClientWrapper";

export class CommandRegistry {

    private static readonly REGISTRY: Map<string, Command<any>> = new Map();

    public static initialize() {
        new CmdCountSyllables();
        new CmdCountSyllablesPerWord();
        new CmdSetWriteableChannel();
    }

    public static setClientWrapper(cw: ClientWrapper) {
        for ( const value of this.REGISTRY.values() ) {
            value.setClientWrapper(cw);
        }
    }

    public static registerCommand(cmd: Command<any>) {
        this.REGISTRY.set(cmd.name(), cmd);
    }

    public static async executeMatching<T extends CommandInteraction>(name: string, interaction: T): Promise<void> {
        this.REGISTRY.get(name)?.execute(interaction);
    }

    public static async deployAll(token: string, clientId: string, guildId: string): Promise<void> {
        const rest = new REST({ version: "10" }).setToken(token);

        let cmds = [];
        for ( const cmd of this.REGISTRY.values() ) {
            cmds.push(cmd);
        }

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: cmds.map(cmd => cmd.data()) }
        );
    }

}