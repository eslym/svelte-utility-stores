import { createSubscriber } from 'svelte/reactivity';

const notifiers = new Map<Storage, Map<string, () => void>>();
const subscribers = new Map<Storage, Map<string, () => void>>();
const proxies = new Map<Storage, Record<string, string | null>>();

const orig = {
    getItem: Storage.prototype.getItem,
    setItem: Storage.prototype.setItem,
    removeItem: Storage.prototype.removeItem,
    clear: Storage.prototype.clear
};

function get_notifiers_map(storage: Storage): Map<string, () => void> {
    if (!notifiers.has(storage)) {
        notifiers.set(storage, new Map<string, () => void>());
    }
    return notifiers.get(storage) as Map<string, () => void>;
}

function get_subscribers_map(storage: Storage): Map<string, () => void> {
    if (!subscribers.has(storage)) {
        subscribers.set(storage, new Map<string, () => void>());
    }
    return subscribers.get(storage) as Map<string, () => void>;
}

Storage.prototype.getItem = function (key) {
    if (subscribers.get(this)?.has(key)) {
        subscribers.get(this)!.get(key)?.();
    } else {
        const instance = this;
        const subscribe = createSubscriber((update) => {
            const map = get_notifiers_map(instance);
            map.set(key, update);
            return () => map.delete(key);
        });
        get_subscribers_map(this).set(key, subscribe);
        subscribe();
    }
    return orig.getItem.call(this, key);
};

Storage.prototype.setItem = function (key, value) {
    const old = orig.getItem.call(this, key);
    if (old === value) return;
    orig.setItem.call(this, key, value);
    notifiers.get(this)?.get(key)?.();
};

Storage.prototype.removeItem = function (key) {
    const old = orig.getItem.call(this, key);
    if (old === null) return;
    orig.removeItem.call(this, key);
    if (notifiers.has(this)) {
        notifiers.get(this)?.get(key)?.();
    }
};

Storage.prototype.clear = function () {
    orig.clear.call(this);
    if (notifiers.has(this)) {
        notifiers.get(this)?.forEach((update) => update());
    }
};

window.addEventListener('storage', (event) => {
    if (!event.storageArea) return;
    if (event.key) {
        notifiers.get(event.storageArea)?.get(event.key)?.();
    } else {
        notifiers.get(event.storageArea)?.forEach((update) => update());
    }
});

/**
 * Create a reactive property descriptor for a storage object.
 * @param storage the storage object
 * @param key the key to access
 * @returns a property descriptor
 */
export function storageDescriptor(storage: Storage, key: string) {
    return {
        get() {
            return storage.getItem(key);
        },
        set(value: string | null) {
            if (value === null) {
                storage.removeItem(key);
            } else {
                storage.setItem(key, value);
            }
        }
    };
}

/**
 * Create a proxy for a storage object which works like a svelte reactive object.
 * @param storage a storage object
 * @returns a proxy object
 */
export function storageProxy(storage: Storage): Record<string, string | null> {
    if (proxies.has(storage)) {
        return proxies.get(storage)!;
    }
    const src = Object.preventExtensions({} as Record<string, string | null>);
    const proxy = new Proxy(src, {
        get(_, key) {
            if (typeof key !== 'string') {
                return undefined;
            }
            return storage.getItem(key);
        },
        set(_, key, value) {
            if (typeof key !== 'string') {
                return false;
            }
            if (value === null) {
                storage.removeItem(key);
            } else {
                storage.setItem(key, value);
            }
            return true;
        },
        has(_, p) {
            if (typeof p !== 'string') {
                return false;
            }
            return storage.getItem(p) !== null;
        },
        ownKeys() {
            return Array.from(storage.keys());
        },
        getOwnPropertyDescriptor(_, key) {
            if (typeof key !== 'string') {
                return undefined;
            }
            return {
                configurable: true,
                enumerable: true,
                ...storageDescriptor(storage, key)
            };
        },
        isExtensible() {
            return false;
        },
        preventExtensions() {
            return true;
        },
        deleteProperty(_, key) {
            if (typeof key !== 'string') {
                return false;
            }
            storage.removeItem(key);
            return true;
        }
    });
    proxies.set(storage, proxy);
    return proxy;
}
