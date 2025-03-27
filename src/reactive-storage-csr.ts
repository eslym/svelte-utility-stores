import { create_hooks } from './reactive-storage-impl';

const { storageDescriptor, storageProxy } = create_hooks();

export { storageDescriptor, storageProxy };
