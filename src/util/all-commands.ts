import { CmdCountSyllables } from '../commands/CmdCountSyllables.js';
import { CmdCountSyllablesPerWord } from '../commands/CmdCountSyllablesPerWord.js';
import { CmdSetWriteableChannel } from '../commands/CmdSetWriteableChannel.js';
import { CmdUpdateSyllableCount } from '../commands/CmdUpdateSyllableCount.js';

export const COMMANDS = [
  new CmdCountSyllables(),
  new CmdCountSyllablesPerWord(),
  new CmdSetWriteableChannel(),
  new CmdUpdateSyllableCount(),
];
