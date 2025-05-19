export interface ReactiveStorageEvent {
    type: 'set' | 'update';
    storage: Storage;
    key: string;
    value: string | null;
}

/**
 * Create a reactive property descriptor for a storage object.
 * @param storage the storage object
 * @param key the key to access
 * @returns a property descriptor
 */
export function storageDescriptor(storage: Storage, key: string) {
    throw new Error('storageDescriptor is not available in SSR');
}

/**
 * Create a proxy for a storage object which works like a svelte reactive object.
 * @param storage a storage object
 * @returns a proxy object
 */
export function storageProxy(storage: Storage): Record<string, string | null> {
    throw new Error('storageProxy is not available in SSR');
}

const noop = () => {};

/**
 * Listen to changes when the storage is updated in the same tab.
 * @param storage the storage object
 * @param callback the callback function to call when the storage is updated
 * @returns a function to remove the listener
 */
export function onStorageSet(
    storage: Storage,
    callback: (event: ReactiveStorageEvent) => void
): () => void {
    return noop;
}

/**
 * Listen to changes when the storage is updated in different tabs.
 * @param storage the storage object
 * @param callback the callback function to call when the storage is updated
 * @returns a function to remove the listener
 */
export function onStorageUpdate(
    storage: Storage,
    callback: (event: ReactiveStorageEvent) => void
): () => void {
    return noop;
}
