<script>
    import { derived } from 'svelte/store';
    import { myGrid, submitGrid } from '../config/firebase';

    let victory = false;

    let gridComplete = derived(myGrid, grid => grid && grid.length === grid.filter(item => item.selected).length);

    let errorMessage = undefined;
    function submit() {
        submitGrid()
            .then(() => {
                errorMessage = undefined;
                victory = true;
            })
            .catch(error => {
                console.error('Invalid grid: ' + error);
                errorMessage = 'The grid was incorrect';
            })
    }
</script>

{#if victory}
    <p>Congratulations! See the results screen for the game results.</p>
{:else}
    {#if errorMessage}
        <div id="error"><span>{errorMessage}</span></div>
    {/if}
        {#if !$myGrid}
            <p>There is no active game.</p>
        {:else}
            <div id="grid">
                {#each $myGrid as item}
                    <div class="square selectable" class:selected="{item.selected}" on:click="{item.select}">
                        <div>
                            <span>{item.text}</span>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {#if $gridComplete}
        <button type="submit" on:click="{submit}">Bingo!</button>
    {/if}
{/if}

<style>
    #error {
        position: absolute;
        width: calc(100% - 32px);
    }

    #grid {
        margin-top: 115px;
        min-width: 200px;
        max-width: 900px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .square {
        position: relative;
        flex: 0 0 32%;
        margin-top: 2%;

        flex: 0 0 32%;
        margin-top: 2%;
    }

    .square:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    .square > div {
        position: absolute;
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .square > div > span {
        vertical-align: middle;
    }

    button {
        margin-top: 19px;
        width: 100%;
    }
</style>