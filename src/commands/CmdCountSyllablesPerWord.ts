import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    MessageFlags
} from "discord.js";
import { Command } from "./Command.js";
import { cleanAndWrapWords, countWrappedWordsSyllables } from "../util/util.js";

export class CmdCountSyllablesPerWord extends Command<MessageContextMenuCommandInteraction> {

    name() : string {
        return "Count Syllables (per word)";
    }

    data() {
        return new ContextMenuCommandBuilder()
            .setName(this.name())
            .setType(ApplicationCommandType.Message);
    }

    async execute(interaction : MessageContextMenuCommandInteraction): Promise<void> {
        const msg = interaction.targetMessage;
        const content = msg.content;

        const kvs = this.keyValueStore(interaction);
        if ( !kvs ) {
            console.error("No kvs found.");
            return;
        }

        const wordsWithSyllables = cleanAndWrapWords(kvs, content);
        const total = countWrappedWordsSyllables(wordsWithSyllables);
        const response = wordsWithSyllables.map(w => `${w.word}: ${w.syllables}`).concat(`Total: ${total}`).join('\n');

        await interaction.reply({
            content: response,
            flags: MessageFlags.Ephemeral
        });
    }

}