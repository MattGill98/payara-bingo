<script>
    import { game } from '../config/firebase';
</script>

<div>
{#if !$game.started || !$game.grid}
    <p>There is no active game.</p>
{:else}
    {#each $game.grid as item}
        <p>{item}</p>
    {/each}
{/if}
</div>