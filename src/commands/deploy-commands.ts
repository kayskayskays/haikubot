import "dotenv/config";
import { CommandRegistry } from "./CommandRegistry";
import { CMDS } from "../util/all-commands";

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!;

const registry = new CommandRegistry(CMDS);
await registry.deployAll(token, clientId, guildId).catch(_ => process.exit(1));
