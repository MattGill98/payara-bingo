<script>
    import { derived } from 'svelte/store';
    import { game, buzzwords } from '../../config/firebase';
    
    let selectedBuzzwords = derived(buzzwords, list => list.filter(item => item.val.selected));
    let activeBuzzwords = derived(buzzwords, list => list.filter(item => item.val.active));
</script>

<h1>Game Status</h1>
<p>Started: {Boolean($game.started)}</p>
{#if $game.started}
    <button type="button" on:click="{$game.end}">End Game</button>
{:else}
    <button type="button" on:click="{$game.start}">Start Game</button>
{/if}

<h1>Selected Buzzwords</h1>
<div>
{#each $selectedBuzzwords as item}
    <p on:click="{item.verify}">
        {#if item.val.verified}
            <strong>{item.val.text}</strong>
        {:else}
            {item.val.text}
        {/if}
    </p>
{/each}
</div>

<h1>Active Buzzwords</h1>
<div>
{#each $activeBuzzwords as item}
    <p>{item.val.text}</p>
{/each}
</div>