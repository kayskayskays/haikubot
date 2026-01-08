import { Command } from "./Command.js";
import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

export class CmdSetWriteableChannel extends Command<ChatInputCommandInteraction> {

    async execute(interaction : ChatInputCommandInteraction) : Promise<void> {
        const channelId = interaction.channelId;

        this.clientWrapper()!.setWriteableChannelId(channelId);

        await interaction.reply({
            content: "Success!",
            flags: MessageFlags.Ephemeral
        });
    }

    data() {
        return new SlashCommandBuilder()
            .setName("set-channel")
            .setDescription("Sets the current channel for the bot to write to.");
    }

    name() : string {
        return "Set the channel for the bot to write to.";
    }

}