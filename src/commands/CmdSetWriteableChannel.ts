import { Command } from "./Command.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export class CmdSetWriteableChannel extends Command<ChatInputCommandInteraction> {

    public static readonly KEY: string = "writeable-channel";

    async execute(interaction : ChatInputCommandInteraction) : Promise<void> {
        const channelId = interaction.channelId;

        const kvs = this.keyValueStore(interaction);
        kvs?.set(CmdSetWriteableChannel.KEY, channelId);

        await interaction.reply("Success!");
    }

    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription("Sets the current channel for the bot to write to.");
    }

    name() : string {
        return "set-channel";
    }

}
