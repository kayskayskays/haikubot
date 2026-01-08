import { Command } from "./Command.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export class CmdSetWriteableChannel extends Command<ChatInputCommandInteraction> {

    async execute(interaction : ChatInputCommandInteraction) : Promise<void> {
        const channelId = interaction.channelId;

        this.clientWrapper()!.setWriteableChannelId(channelId);

        return undefined;
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