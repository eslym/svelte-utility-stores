import { derived, get, type Writable } from 'svelte/store';
import type { MutationStoreFactor, Store, StringifyParse } from './types';

export default function stringify<T>(
    serializer: StringifyParse<T>,
    base: Writable<string | null>
): Store<T | undefined>;
export default function stringify<T>(
    serializer: StringifyParse<T>,
    base: Writable<string | null>,
    fallback: () => T
): Store<T>;
export default function stringify(
    serializer: StringifyParse<any>,
    base: Writable<string | null>,
    fallback?: () => any
): Store<any> {
    const store = derived(base, ($base) => {
        if ($base === null) {
            return fallback?.();
        }
        return serializer.parse($base);
    });

    function set(value: any) {
        base.set(serializer.stringify(value));
    }

    function update(fn: (value: any) => any) {
        set(fn(get(store)));
    }

    return { ...store, set, update, get: get.bind(null, store) };
}

export function storeWith<T = any>(serializer: StringifyParse<T>): MutationStoreFactor<T> {
    return stringify.bind(null, serializer as any) as any;
}
