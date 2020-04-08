<script>
    import { derived } from 'svelte/store';
    import { buzzwords } from '../config/firebase';

    let selected = derived(buzzwords, list => list.filter(item => item.val.selected));
</script>

<div>
{#each $selected as item}
    <p>{item.val.text}</p>
{/each}
</div>