<script>
    import { derived } from 'svelte/store';
    import { currentGameId, buzzwords, selectedBuzzwords, startGame, endGame } from '../config/firebase';
</script>

<h1>Game Status</h1>
{#if $currentGameId}
    <button type="submit" on:click="{endGame}">End Game</button>
{:else}
    <button type="submit" on:click="{startGame}">Start Game</button>
{/if}

<h1>Selected Buzzwords</h1>
<div>
{#each $selectedBuzzwords as item}
    <p on:click="{item.verify}">
        {#if item.verified}
            <strong>{item.text}</strong>
        {:else}
            {item.text}
        {/if}
    </p>
{/each}
</div>