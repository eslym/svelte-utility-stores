import { get, writable } from 'svelte/store';
import type { StorageStore } from './types';

function store(key: string): StorageStore;
function store(key: string): StorageStore {
    const base = writable<string | null>(null);

    return {
        ...base,
        get: get.bind(null, base) as any,
        clear: () => {
            const old = get(base);
            base.set(null);
            return old;
        },
        get key() {
            return key;
        }
    };
}

export default store;
