import { Command } from './Command.js';
import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  MessageFlags,
} from 'discord.js';
import { countSyllables } from '../util/util.js';

export class CmdCountSyllables extends Command<MessageContextMenuCommandInteraction> {
  name(): string {
    return 'Count Syllables';
  }

  data() {
    return new ContextMenuCommandBuilder()
      .setName(this.name())
      .setType(ApplicationCommandType.Message);
  }

  async execute(
    interaction: MessageContextMenuCommandInteraction,
  ): Promise<void> {
    const msg = interaction.targetMessage;
    const content = msg.content;

    const kvs = this.keyValueStore(interaction);
    if (!kvs) {
      return;
    }

    await interaction.reply({
      content: `${countSyllables(kvs, content)} syllables.`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
