import * as ssr from './reactive-storage-ssr';
import { create_hooks } from './reactive-storage-impl';

let storageDescriptor = ssr.storageDescriptor;
let storageProxy = ssr.storageProxy;
let onStorageSet = ssr.onStorageSet;
let onStorageUpdate = ssr.onStorageUpdate;

if (typeof globalThis.window !== 'undefined') {
    const csr = create_hooks();
    storageDescriptor = csr.storageDescriptor;
    storageProxy = csr.storageProxy;
    onStorageSet = csr.onStorageSet;
    onStorageUpdate = csr.onStorageUpdate;
}

export type ReactiveStorageEvent = ssr.ReactiveStorageEvent;

export { storageDescriptor, storageProxy, onStorageSet, onStorageUpdate };
