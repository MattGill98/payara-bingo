<script>
    import { currentGameResults, previousGameResults } from '../config/firebase';
    import { derived } from 'svelte/store';

    let convertResultsToArray = store => derived(store, results => {
        if (results) {
            let array = Object.values(results)
                .reduce((acc, { name, score }) => acc.concat([{name, score}]), [])
                .sort((a, b) => b.score - a.score);
            return array;
        }
        return results;
    });
    let currentGameArray = convertResultsToArray(currentGameResults);
    let previousGameArray = convertResultsToArray(previousGameResults);
</script>

<h1>Current Game</h1>

<pre>
    {#if $currentGameArray}
        {#each $currentGameArray as result}
            <p>{result.name}: {result.score}</p>
        {/each}
    {:else}
        N/A
    {/if}
</pre>

<h1>Previous Game</h1>


<pre>
    {#if $previousGameArray}
        {#each $previousGameArray as result}
            <p>{result.name}: {result.score}</p>
        {/each}
    {:else}
        N/A
    {/if}
</pre>