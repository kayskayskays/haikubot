import { Command } from "./Command.js";
import {
    ApplicationCommandDataResolvable,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

export class CmdUpdateSyllableCount extends Command<ChatInputCommandInteraction>{

    data() : ApplicationCommandDataResolvable {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription("Set the syllable count for a word.")
            .addStringOption(opt =>
                opt
                    .setName("word")
                    .setDescription("The word to update.")
                    .setRequired(true)
            )
            .addIntegerOption(opt =>
                opt
                    .setName("count")
                    .setDescription("Syllable count.")
                    .setRequired(true)
                    .setMinValue(0)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    }

    async execute(interaction : ChatInputCommandInteraction) : Promise<void> {
        const word = interaction.options.getString("word", true);
        const count = interaction.options.getInteger("count", true);

        const guildId = interaction.guildId;
        if ( !guildId ) {
            console.error("No guild ID found.");
            return undefined;
        }

        const kvs = this.clientWrapper()!.kvStore(guildId);
        kvs.set(word, String(count));

        await interaction.reply({ content: `Updated **${word}** → ${count} syllable(s).`, });
    }

    name() : string {
        return "update-syllable-count";
    }

}
