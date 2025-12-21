import "dotenv/config";
import { CommandRegistry } from "./commands/CommandRegistry.js";

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!;

CommandRegistry.instantiate();

await CommandRegistry.deployAll(token, clientId, guildId).catch(err => {
    console.error("❌ Failed to deploy commands:");
    console.error(err);
    process.exit(1);
});
