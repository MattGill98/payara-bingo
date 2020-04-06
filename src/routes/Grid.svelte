<script>
    import { buzzwords } from '../config/firebase';
</script>

<div>
{#each Array(9) as _, i}
    {#if $buzzwords.length > i}
        <div><p>{$buzzwords[i].val.text}</p></div>
    {/if}
{/each}
</div>