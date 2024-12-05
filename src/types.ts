import type { Writable } from 'svelte/store';

/**
 * Svelte store which have a get method to get the current value.
 */
export type Store<T> = Writable<T> & {
    /**
     * Get the current value of the store.
     */
    get(): T;
};

/**
 * Svelte store which persists its value in a storage, either local or session.
 */
export type StorageStore = Store<string | null> & {
    key: string;
    /**
     * Clear the store and return the previous value.
     */
    clear(): string | null;
};

export interface StringifyParse<T> {
    stringify: (value: T) => string;
    parse: (value: string) => T;
}

export type MutationStoreFactor<Base extends any> =
    | (<T extends Base>(base: Writable<string | null>) => Store<T | undefined>)
    | (<T extends Base>(base: Writable<string | null>, fallback: () => T) => Store<T>);
