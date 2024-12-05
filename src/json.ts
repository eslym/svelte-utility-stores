import { storeWith } from './stringify';

/**
 * Read from and write to the base store in JSON format.
 */
const json = storeWith(JSON);

export default json;
