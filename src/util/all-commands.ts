import { CmdCountSyllables } from "../commands/CmdCountSyllables.js";
import { CmdCountSyllablesPerWord } from "../commands/CmdCountSyllablesPerWord.js";
import { CmdSetWriteableChannel } from "../commands/CmdSetWriteableChannel.js";

export const CMDS = [
    new CmdCountSyllables(),
    new CmdCountSyllablesPerWord(),
    new CmdSetWriteableChannel(),
];