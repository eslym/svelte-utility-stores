import { createSubscriber } from 'svelte/reactivity';
import { get, type Readable, type Writable } from 'svelte/store';

/**
 * Create a reactive property descriptor.
 * @param value initial value
 * @returns a property descriptor
 */
export function wrapValue(value?: any): PropertyDescriptor {
    let notify: (() => void) | null = null;
    const subscribe = createSubscriber((update) => {
        notify = update;
        return () => {
            notify = null;
        };
    });
    return {
        get() {
            subscribe();
            return value;
        },
        set(newValue: any) {
            value = newValue;
            notify?.();
        }
    };
}

/**
 * Wrap a svelete store to a reactive property descriptor.
 * @param store a svelte store
 * @returns a property descriptor
 */
export function wrapStore<T>(store: Readable<T> | Writable<T>): PropertyDescriptor {
    const subscribe = createSubscriber((update) => {
        return store.subscribe(() => update);
    });
    return {
        get() {
            subscribe();
            return get(store);
        },
        set: 'set' in store ? store.set : undefined
    };
}
