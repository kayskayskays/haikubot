import { Command } from "./Command.js";
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    MessageFlags
} from "discord.js";
import { countSyllables } from "../util/util.js";

export class CmdCountSyllables extends Command<MessageContextMenuCommandInteraction> {

    data() {
        return new ContextMenuCommandBuilder()
            .setName(this.name())
            .setType(ApplicationCommandType.Message);
    }

    async execute(interaction: MessageContextMenuCommandInteraction) : Promise<void> {
        const msg = interaction.targetMessage;
        const content = msg.content;

        const guildId = interaction.guildId;
        if ( !guildId ) {
            console.error("No guild ID found.");
            return;
        }

        await interaction.reply({
            content: `${countSyllables(this.clientWrapper()!.kvStore(guildId), content)} syllables.`,
            flags: MessageFlags.Ephemeral
        });
    }

    name(): string {
        return "Count Syllables";
    }

}
