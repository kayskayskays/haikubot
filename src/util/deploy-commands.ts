import 'dotenv/config';
import { CommandRegistry } from '../commands/CommandRegistry.js';
import { COMMANDS } from './all-commands.js';

const [guildId, ...extraArgs] = process.argv.slice(2);
if (guildId == undefined || extraArgs.length > 0) {
  console.error('Usage: haikubot-deploy <guild-id>');
  process.exit(1);
}

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;

const registry = new CommandRegistry(COMMANDS);
await registry.deployAll(token, clientId, guildId).catch((err) => {
  console.error('Failed to deploy commands:', err);
  process.exit(1);
});
