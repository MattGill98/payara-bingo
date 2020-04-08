<script>
    import { activeBuzzwords, game } from '../config/firebase';
</script>

<div>
{#if !$game.started}
    <p>There is no active game.</p>
{:else}
    {#each $activeBuzzwords as item}
        <p>{item.val.text}</p>
    {/each}
{/if}
</div>