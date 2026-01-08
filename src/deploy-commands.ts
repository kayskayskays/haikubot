import "dotenv/config";
import { CommandRegistry } from "./commands/CommandRegistry.js";

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!;

await CommandRegistry.deployAll(token, clientId, guildId).catch(_ => process.exit(1));
