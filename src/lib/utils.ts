import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function expr<T>(fn: () => T) {
    return fn();
}

export function assert(
    condition: boolean,
    message?: string,
): asserts condition {
    if (!condition) {
        throw new Error(`Assertion failed${message && `: ${message}`}`);
    }
}
