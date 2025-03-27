import * as ssr from './reactive-storage-ssr';
import { create_hooks } from './reactive-storage-impl';

let storageDescriptor = ssr.storageDescriptor;
let storageProxy = ssr.storageProxy;

if (typeof globalThis.window !== 'undefined') {
    const csr = create_hooks();
    storageDescriptor = csr.storageDescriptor;
    storageProxy = csr.storageProxy;
}

export { storageDescriptor, storageProxy };
