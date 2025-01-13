# @eslym/svelte-utility-stores

Some utility svelte stores

> [!IMPORTANT]  
> Version 2 removed array, map and set since svelte 5 has built-in support for them.

## Install

```bash
npm i -D @eslym/svelte-utility-stores
```

```bash
yarn add -D @eslym/svelte-utility-stores
```

## Usage

### Local Storage and Session Storage stores

Stores which read from and write to the Storage objects, could be `localStorage` or `sessionStorage`,
the store will aware to the call of `Storage#setItem`, `Storage#removeItem`, `Storage#clear` and even
the `storage` event of `windows`.

> [!NOTE]  
> In SSR, the store returned will just be a regular `writable` store.

```svelte
<script lang="ts">
    import { local } from "@eslym/svelte-utility-stores";
    // or
    import local from "@eslym/svelte-utility-stores/local";

    const token = local('token');

    $inspect($token);
</script>
```

```svelte
<script lang="ts">
    import { session } from "@eslym/svelte-utility-stores";
    // or
    import session from "@eslym/svelte-utility-stores/session";

    const token = session('token');

    $inspect($token);
</script>
```

### Stringify store

```svelte
<script lang="ts">
    import { stringify } from "@eslym/svelte-utility-stores";
    // or
    import stringify from "@eslym/svelte-utility-stores/stringify";

    import superjson from 'superjson';

    // serialize to local storage with the 'token' key using superjson
    const token = stringify<{ token: string; expires: Date; }>(superjson, local('token'));

    $inspect($token);
</script>
```

### JSON store

```svelte
<script lang="ts">
    import { json } from "@eslym/svelte-utility-stores";
    // or
    import json from "@eslym/svelte-utility-stores/json";

    // serialize to local storage with the 'token' key using json
    const token = json<{ token: string; expires: string; }>(local('token'));

    $inspect($token);
</script>
```

> [!CAUTION]
> The `json` function is now taking a function for a fallback value instead of the value itself.

### Masked

Create a pair of stores which for masking, the display store will return the masked value when
the value store is `undefined` (unchanged), useful for password input field.

```svelte
<script lang="ts">
    import { masked } from "@eslym/svelte-utility-stores";
    // or
    import masked from "@eslym/svelte-utility-stores/masked";

    const { value: password, display: passwordDisplay } = masked();

    $inspect([$passwordDisplay, $password]);
</script>

<form method="post">
    {#if $password !== undefined}
        <input type="hidden" name="passwordUpdate" bind:value={$password} />
    {/if}
    <input type="password" bind:value={$passwordDisplay}/>
    <button disabled={$password === undefined}>Update</button>
    <button type="button" onclick={() => $password = undefined}>Reset</button>
</form>
```

### Reactivity (requires svelte >= 5.7.0)

Wrap a value or svelte store into a reactive property descriptor which can be used in
`Object.defineProperty` to create reactive object.

```svelte
<script lang="ts">
    // can only import from "@eslym/svelte-utility-stores/reactivity"
    import { wrapValue, wrapStore } from "@eslym/svelte-utility-stores/reactivity";

    import local from "@eslym/svelte-utility-stores/local";

    let obj = Object.defineProperties({}, {
        value: wrapValue('Hello, World!'),
        store: wrapStore(local('some-example')),
    });
</script>

<!-- Svelte will gives warning but these will works just fine  -->
<input type="text" bind:value={obj.value} />
<input type="text" bind:value={obj.store} />

```
