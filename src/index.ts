import "dotenv/config";
import { CommandRegistry } from "./commands/CommandRegistry.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { ClientWrapper } from "./client/ClientWrapper.js";
import { registerHandlers } from "./client/handlers.js";
import { CMDS } from "./util/all-commands.js";

export const createClient = () => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    });

    const cw = new ClientWrapper(client);
    const registry = new CommandRegistry(CMDS);
    registry.setClientWrapper(cw);

    registerHandlers(cw);

    client.on(Events.InteractionCreate, async (interaction) => {
        if ( !interaction.isCommand() ) {
            return;
        }

        await registry.executeMatching(interaction.commandName, interaction);
    });

    return cw;
};

const run = async () => {
    const token = process.env.DISCORD_TOKEN;
    if ( !token ) {
        throw new Error("No token provided for the bot.");
    }

    const cw = createClient();


    await cw.login(token);
};

await run();