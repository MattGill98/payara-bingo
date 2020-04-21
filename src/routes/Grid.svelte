<div>
{#if !$game.started || !$game.grid}
    <p>There is no active game.</p>
{:else}
    {#each $game.grid as item}
        <p on:click="{item.toggle}">
            {#if item.selected}
                <strong>{item.text}</strong>
            {:else}
                {item.text}
            {/if}
        </p>
    {/each}
{/if}
</div>

<script>
    import { game } from '../config/firebase';
</script>