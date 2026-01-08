import { Command } from "./Command.js";
import { CommandInteraction, REST, Routes } from "discord.js";
import { ClientWrapper } from "../client/ClientWrapper";

export class CommandRegistry {

    private readonly _registry: Map<string, Command<any>> = new Map();

    public constructor(cmds: Command<any>[]) {
        cmds.forEach(cmd => this._registry.set(cmd.name(), cmd));
    }

    public setClientWrapper(cw: ClientWrapper) {
        for ( const value of this._registry.values() ) {
            value.setClientWrapper(cw);
        }
    }

    public async executeMatching<T extends CommandInteraction>(name: string, interaction: T): Promise<void> {
        this._registry.get(name)?.execute(interaction);
    }

    public async deployAll(token: string, clientId: string, guildId: string): Promise<void> {
        const rest = new REST({ version: "10" }).setToken(token);

        let cmds = [];
        for ( const cmd of this._registry.values() ) {
            cmds.push(cmd);
        }

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: cmds.map(cmd => cmd.data()) }
        );
    }

}