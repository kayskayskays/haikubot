import "dotenv/config";
import { CommandRegistry } from "../commands/CommandRegistry.js";
import { CMDS } from "./all-commands.js";

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!;

const registry = new CommandRegistry(CMDS);
await registry.deployAll(token, clientId, guildId).catch(_ => process.exit(1));
