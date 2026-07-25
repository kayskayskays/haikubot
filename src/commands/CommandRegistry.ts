import { Command } from './Command.js';
import { CommandInteraction, REST, Routes } from 'discord.js';
import { ClientWrapper } from '../client/ClientWrapper.js';

export class CommandRegistry {
  private readonly _registry: Map<string, Command<any>> = new Map();

  constructor(cmds: Command<any>[]) {
    cmds.forEach((cmd) => this._registry.set(cmd.name(), cmd));
  }

  setClientWrapper(cw: ClientWrapper) {
    for (const value of this._registry.values()) {
      value.setClientWrapper(cw);
    }
  }

  async executeMatching(
    name: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    this._registry.get(name)?.execute(interaction);
  }

  async deployAll(
    token: string,
    clientId: string,
    guildId: string,
  ): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(token);
    const body = [...this._registry.values()].map((cmd) => cmd.data());
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body,
    });
  }
}
