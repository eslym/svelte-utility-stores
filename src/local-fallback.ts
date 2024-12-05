import store from './ssr-stores';
import { createStoreFactory } from './storage';

const local = typeof globalThis.window === 'undefined' ? store : createStoreFactory('local');
export default local;
