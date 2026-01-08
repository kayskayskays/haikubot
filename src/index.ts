import "dotenv/config";
import { createClient } from "./bot.js";
import { CommandRegistry } from "./commands/CommandRegistry.js";
import { ClientWrapper } from "./ClientWrapper";

const run = async () => {
    const token = process.env.DISCORD_TOKEN;
    if ( !token ) {
        throw new Error("No token provided for the bot.");
    }
    const clientWrapper = new ClientWrapper(createClient());

    CommandRegistry.initialize();
    CommandRegistry.setClientWrapper(clientWrapper);

    await clientWrapper.login(token);
};

await run();