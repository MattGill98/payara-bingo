<script>
    import { derived } from 'svelte/store';
    import { currentGameId, buzzwords, selectedBuzzwords, currentGameBuzzwords, startGame, endGame } from '../config/firebase';
</script>

<h1>Game Status</h1>
{#if $currentGameId}
    <button type="submit" on:click="{endGame}">End Game</button>
{:else}
    <button type="submit" on:click="{startGame}">Start Game</button>
{/if}

{#if $currentGameBuzzwords}
    <h1>Game Buzzwords</h1>
    <ul>
        {#each $currentGameBuzzwords as item}
            <li class="selectable" on:click="{item.verify}" class:selected="{item.verified}">
                <span>{item.text}</span>
            </li>
        {/each}
    </ul>
{/if}

<h1>Selected Buzzwords</h1>

<ul>
    {#each $selectedBuzzwords as item}
        <li class="selectable selected">
            <span>{item.text}</span>
        </li>
    {/each}
</ul>