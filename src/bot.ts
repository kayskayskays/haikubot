import { Client, Events, GatewayIntentBits } from "discord.js";
import { registerHandlers } from "./handlers.js";
import { CommandRegistry } from "./commands/CommandRegistry.js";

export const createClient = () => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    });

    registerHandlers(client);

    client.on(Events.InteractionCreate, async (interaction) => {
        if ( !interaction.isMessageContextMenuCommand() ) {
            return;
        }

        await CommandRegistry.executeMatching(interaction.commandName, interaction);
    });

    return client;
};