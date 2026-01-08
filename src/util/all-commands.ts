import { CmdCountSyllables } from "../commands/CmdCountSyllables";
import { CmdCountSyllablesPerWord } from "../commands/CmdCountSyllablesPerWord";
import { CmdSetWriteableChannel } from "../commands/CmdSetWriteableChannel";

export const CMDS = [
    new CmdCountSyllables(),
    new CmdCountSyllablesPerWord(),
    new CmdSetWriteableChannel(),
];