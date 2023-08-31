# @eslym/svelte-utility-stores

Some utility svelte stores

## Install

```bash
npm i -D @eslym/svelte-utility-stores
```

```bash
yarn add -D @eslym/svelte-utility-stores
```

## Usage

```svelte
<script>
    import { array } from '@eslym/svelte-utility-stores';

    const arr = array(['item 1', 'item 2']);
</script>

<!-- just use .push for the array -->
<button type="button" on:click={()=>$arr.push(`item ${$arr.length + 1}`)}>Add Item</button>
<ul>
    {#each $arr as item}
        <li>{item}</li>
    {/each}
</ul>
```

More example on this [Svelte REPL](https://svelte.dev/repl/57c9b4082c314d96a1d92fb723802ecf?version=4.2.0)
