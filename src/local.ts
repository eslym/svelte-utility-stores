import { createStoreFactory } from './storage';

/**
 * Get a svelte store based on local storage store by the given key.
 */
const local = createStoreFactory('local');

export default local;
