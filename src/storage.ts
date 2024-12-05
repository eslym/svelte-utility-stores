import { writable } from 'svelte/store';
import type { StorageStore } from './types';

const kSetVal = Symbol('set value');

function decorateStorage(
    src: 'local' | 'session',
    stores: Map<
        string,
        StorageStore & {
            [kSetVal]: (val: string | null) => void;
        }
    >
) {
    const source = src === 'local' ? localStorage : sessionStorage;
    const parent = Object.getPrototypeOf(source) as Storage;
    const proto = {
        setItem(key: string, value: string) {
            const store = stores.get(key);
            if (store) {
                store[kSetVal](value);
            }
            return parent.setItem.call(this, key, value);
        },
        removeItem(key: string) {
            const store = stores.get(key);
            if (store) {
                store[kSetVal](null);
            }
            return parent.removeItem.call(this, key);
        },
        clear() {
            stores.forEach((store) => store[kSetVal](null));
            return parent.clear.call(this);
        }
    };
    Object.setPrototypeOf(source, proto);
    window.addEventListener('storage', (e) => {
        if (!e.storageArea || e.storageArea !== source) return;
        if (e.key) {
            const store = stores.get(e.key);
            if (!store) return;
            store[kSetVal](e.newValue);
        } else {
            stores.forEach((store) => store[kSetVal](null));
        }
    });
}

function storeFactory(src: Storage, stores: Map<string, StorageStore>, key: string) {
    if (stores.has(key)) {
        return stores.get(key)!;
    }
    const base = writable<string | null>(src.getItem(key));

    function set(value: string | null) {
        if (value === null) {
            src.removeItem(key);
        } else {
            src.setItem(key, value);
        }
        base.set(value);
    }

    function update(fn: (value: string | null) => string | null) {
        set(fn(src.getItem(key)));
    }

    const store = {
        ...base,
        get: () => {
            return src.getItem(key);
        },
        clear: () => {
            const old = src.getItem(key);
            base.set(null);
            return old;
        },
        set,
        update,
        get key() {
            return key;
        },
        [kSetVal]: base.set
    };

    stores.set(key, store);
    return store;
}

export function createStoreFactory(src: 'local' | 'session'): (key: string) => StorageStore {
    const stores = new Map<
        string,
        StorageStore & {
            [kSetVal]: (val: string | null) => void;
        }
    >();
    const source = src === 'local' ? localStorage : sessionStorage;
    decorateStorage(src, stores);
    return storeFactory.bind(null, source, stores);
}
