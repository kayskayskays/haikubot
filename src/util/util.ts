import { syllable } from "syllable";
import { KeyValueStore } from "../db/KeyValueStore.js";

export type Haiku = Readonly<{ firstLine: string[], secondLine: string[], thirdLine: string[] }>;
export type WordWithSyllables = Readonly<{
    word: string;
    syllables: number;
}>;

export const countSyllables = (kvs: KeyValueStore, text: string) => {
    return countWrappedWordsSyllables(cleanAndWrapWords(kvs, text));
};

export const countWrappedWordsSyllables = (wordsWithSyllables: WordWithSyllables[]) => {
    return wordsWithSyllables.reduce((count, w) => count + w.syllables, 0);
}

export const parseHaiku = (kvs: KeyValueStore, text: string) => {
    const wordsWithSyllables = cleanAndWrapWords(kvs, text)
    const count = countWrappedWordsSyllables(wordsWithSyllables);

    if ( count !== 17 ) {
        return null;
    }

    type HaikuWithRunningCount = Readonly<{
       haiku: Haiku;
       count: number;
    }>;

    const result = wordsWithSyllables.reduce<HaikuWithRunningCount | null>((h, w) => {
        if ( h === null ) {
            return null;
        }

        const currentCount = h.count;
        const currentHaiku = h.haiku;

        // If the syllable count for the word is unknown, just return null.
        if ( w.syllables === 0 ) {
            return null;
        }

        const updatedCount = currentCount + w.syllables;

        let key: keyof Haiku | null = null;
        const validWordPredicate = (left: number, right: number) => left <= currentCount && updatedCount <= right;

        if ( validWordPredicate(0, 5) ) {
            key = "firstLine";
        } else if ( validWordPredicate(5, 12) ) {
            key = "secondLine";
        } else if ( validWordPredicate(12, 17) ) {
            key = "thirdLine";
        }

        if ( !key ) {
            return null;
        }

        const updatedHaiku = { ...currentHaiku, [key]: [ ...currentHaiku[key], w.word] }

        return  { haiku: updatedHaiku , count: updatedCount };
    }, { haiku: { firstLine: [], secondLine: [], thirdLine: [] }, count: 0 } as HaikuWithRunningCount);

    return result?.haiku ?? null;
};

export const cleanAndWrapWords = (kvs: KeyValueStore, text: string) => {
    return wrapWordsWithSyllableCount(kvs, cleanText(text));
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

export const wrapWordsWithSyllableCount = (kvs: KeyValueStore, words: string[]) => {
    return words.map(word => {
        const syllables = kvs.get(word) ?? syllable(word);
        return { word, syllables } as WordWithSyllables;
    });
};

export const formatHaiku = (author: string, channel: string, haiku: Haiku) => {
    return {
        title : ":fish: Haiku Detected :fish:",
        description : `${ haiku.firstLine.join(" ") }\n${ haiku.secondLine.join(" ") }\n${ haiku.thirdLine.join(" ") }`,
        footer : { text : `by ${ author } in #${ channel }` }
    };
};