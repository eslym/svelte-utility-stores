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
