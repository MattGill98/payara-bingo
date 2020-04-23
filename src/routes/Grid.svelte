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

<button type="button" on:click="{submitGrid}">Submit</button>

<script>
    import { game, submitGrid } from '../config/firebase';
</script>