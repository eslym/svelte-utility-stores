import store from './ssr-stores';
import { createStoreFactory } from './storage';

const session = typeof globalThis.window === 'undefined' ? store : createStoreFactory('session');

export default session;
