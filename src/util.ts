import { Guild, PermissionFlagsBits, ChannelType } from "discord.js";
import { syllable } from "syllable";

export type Haiku = Readonly<{ firstLine: string[], secondLine: string[], thirdLine: string[] }>;
export type WordWithSyllables = Readonly<{
    word: string;
    syllables: number;
}>;

export const findWriteableChannel = (guild: Guild) => {
    const botMember = guild.members.me;
    if ( !botMember ) {
        return null;
    }

    for ( const channel of guild.channels.cache.values() ) {
        if ( channel.type !== ChannelType.GuildText ) {
            continue;
        }

        const perms = channel.permissionsFor(botMember);
        if ( !perms ) {
            continue;
        }

        if ( perms.has(PermissionFlagsBits.SendMessages) && channel.name.includes("haiku") ) {
            return channel;
        }
    }

    return null;
};

export const countSyllables = (text: string) => {
    return countWrappedWordsSyllables(cleanAndWrapWords(text));
};

export const countWrappedWordsSyllables = (wordsWithSyllables: WordWithSyllables[]) => {
    return wordsWithSyllables.reduce((count, w) => count + w.syllables, 0);
}

export const parseHaiku = (text: string) => {
    const wordsWithSyllables = cleanAndWrapWords(text)
    const count = countWrappedWordsSyllables(wordsWithSyllables);

    if ( count !== 17 ) {
        return null;
    }

    type HaikuWithRunningCount = Readonly<{
       haiku: Haiku;
       count: number;
    }>;

    return wordsWithSyllables.reduce((h, w) => {
        const currentCount = h.count;
        const currentHaiku = h.haiku;

        let updatedHaiku;
        const updatedCount = currentCount + w.syllables;

        if ( currentCount < 5 ) {
            updatedHaiku = { ...currentHaiku, firstLine: [ ...currentHaiku.firstLine, w.word ] };
        } else if ( currentCount < 12 ) {
            updatedHaiku = { ...currentHaiku, secondLine: [ ...currentHaiku.secondLine, w.word ] };
        } else if ( currentCount < 17 ) {
            updatedHaiku = { ...currentHaiku, thirdLine: [ ...currentHaiku.thirdLine, w.word ] };
        } else {
            throw new Error();
        }

        return  { haiku: updatedHaiku , count: updatedCount };
    }, { haiku: { firstLine: [], secondLine: [], thirdLine: [] }, count: 0 } as HaikuWithRunningCount).haiku;
};

export const cleanAndWrapWords = (text: string) => {
    return wrapWordsWithSyllableCount(cleanText(text));
}

export const cleanText = (text: string) => {
    const cleaned = text
        .replace(/https?:\/\/\S+/g, " ")
        .replace(/<@!?\d+>/g, " ")
        .replace(/<#\d+>/g, " ")
        .replace(/<a?:\w+:\d+>/g, " ")
        .replace(/[^\p{L}\p{N}' -]+/gu, " ")
        .replace("-_", "");

    return cleaned.split(/\s+/).map(w => w.trim()).filter(Boolean);
};

export const wrapWordsWithSyllableCount = (words: string[]) => {
    return words.map(word => {
        return { word, syllables: syllable(word) } as WordWithSyllables;
    });
};

export const formatHaiku = (author: string, channel: string, haiku: Haiku) => {
    return {
        title : ":fish: Haiku Detected :fish:",
        description : `${ haiku.firstLine.join(" ") }\n${ haiku.secondLine.join(" ") }\n${ haiku.thirdLine.join(" ") }`,
        footer : { text : `by ${ author } in #${ channel }` }
    };
};