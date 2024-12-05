import { createStoreFactory } from './storage';

/**
 * Get a svelte store based on session storage store by the given key.
 */
const session = createStoreFactory('session');

export default session;
