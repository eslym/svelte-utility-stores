import { derived, writable } from 'svelte/store';

export default function masked(maskedDisplay: string = '(masked)') {
    const value = writable<string | undefined>();
    const display = derived(value, ($value) => ($value === undefined ? maskedDisplay : $value));

    return {
        value,
        display: {
            ...value,
            subscribe: display.subscribe
        }
    };
}
