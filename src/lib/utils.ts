import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function expr<T>(fn: () => T) {
    return fn();
}

export function assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

export function unreachable(message: string): never {
    throw new Error(`Invariant violated: ${message}`);
}

export function pprint(s: string) {
    try {
        return JSON.stringify(JSON.parse(s), null, 4);
    } catch (_) {
        return s;
    }
}

/**
 * Pluralises `options.word` if the `count` is greater than 1.
 * @param count The number of elements for the word.
 * @param options.word The singular version of the word you wish to pluralise.
 * @param options.plural Override the word to return when `count` is greater than 1.
 * @returns The word in the correct plurality.
 */
export function pluralise(
    count: number,
    options: { word: string; plural?: string },
) {
    const plural = options.plural ?? `${options.word}s`;

    return count === 1 ? options.word : plural;
}
