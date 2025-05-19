import { create_hooks } from './reactive-storage-impl';

const { storageDescriptor, storageProxy, onStorageSet, onStorageUpdate } = create_hooks();

export { storageDescriptor, storageProxy, onStorageSet, onStorageUpdate };
