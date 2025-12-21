import "dotenv/config";
import { createClient } from "./bot.js";
import { CommandRegistry } from "./commands/CommandRegistry.js";

const run = async () => {
    const token = process.env.DISCORD_TOKEN;
    if ( !token ) {
        throw new Error("No token provided for the bot.");
    }

    CommandRegistry.instantiate();
    await createClient().login(token);
};

await run();