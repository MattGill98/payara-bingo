<script>
    import { selectedBuzzwords } from '../config/firebase';
</script>

<div>
{#each $selectedBuzzwords as item}
    <p>{item.val.text}</p>
{/each}
</div>