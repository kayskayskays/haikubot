import { Command } from './Command.js';
import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { CmdSetWriteableChannel } from './CmdSetWriteableChannel.js';

export class CmdListSyllableCountOverrides extends Command<ChatInputCommandInteraction> {
  name(): string {
    return 'list-overrides';
  }

  data() {
    return new SlashCommandBuilder()
      .setName(this.name())
      .setDescription('Lists all syllable count overrides.');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const kvs = this.keyValueStore(interaction);
    if (!kvs) {
      return;
    }

    const response = kvs
      .entries()
      .filter((e) => e.key !== CmdSetWriteableChannel.KEY)
      .map((e) => `**${e.key}** -> ${e.value}`)
      .join('\n');

    await interaction.reply({
      content: response,
      flags: MessageFlags.Ephemeral,
    });
  }
}
