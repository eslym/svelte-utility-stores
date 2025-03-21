import { createSubscriber } from 'svelte/reactivity';
import { get, type Readable, type Writable } from 'svelte/store';

type ReadonlyDescriptor<T> = { get(): T };
type Descriptor<T> = ReadonlyDescriptor<T> & { set(value: T): void };

/**
 * Create a reactive property descriptor.
 * @param value initial value
 * @returns a property descriptor
 */
export function wrapValue<T>(value: T): { get: () => T; set: (value: T) => void } {
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
export function wrapStore<T>(store: Writable<T>): Descriptor<T>;
export function wrapStore<T>(store: Readable<T>): ReadonlyDescriptor<T>;
export function wrapStore(store: Readable<any> | Writable<any>) {
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

type DescriptorValues<
    T extends { [key: string | number | symbol]: Descriptor<any> | ReadonlyDescriptor<any> }
> = {
    [K in keyof T]: T[K] extends Descriptor<infer U> ? U : never;
} & {
    readonly [K in keyof T]: T[K] extends ReadonlyDescriptor<infer U> ? U : never;
};

/**
 * Define properties on an object and return a type-safe version of it.
 * @param target the target
 * @param descriptors the descriptors
 * @returns the target with the properties defined
 */
export function defineProperties<
    T extends {},
    P extends { [key: string | number | symbol]: Descriptor<any> | ReadonlyDescriptor<any> }
>(target: T, descriptors: P): T & DescriptorValues<P> {
    return Object.defineProperties(target, descriptors) as any;
}
