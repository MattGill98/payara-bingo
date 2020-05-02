<script>
    import { myGrid, submitGrid } from '../config/firebase';
</script>

<div id="grid">
    {#if !$myGrid}
        <p>There is no active game.</p>
    {:else}
        {#each $myGrid as item}
            <div class="square selectable" class:selected="{item.selected}" on:click="{item.select}">
                <div>
                    <span>{item.text}</span>
                </div>
            </div>
        {/each}
    {/if}
</div>

<button type="submit" on:click="{submitGrid}">Submit</button>

<style>
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