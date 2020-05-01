<script>
    import { myGrid, submitGrid } from '../config/firebase';
</script>

<div id="content">
    <div id="grid">
        {#if !$myGrid}
            <p>There is no active game.</p>
        {:else}
            {#each $myGrid as item}
                <div class="square" class:selected="{item.selected}" on:click="{item.select}">
                    <div>
                        <span>{item.text}</span>
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <button type="button" on:click="{submitGrid}">Submit</button>
</div>

<style>
    #content {
        padding: 121px 16px 0;
    }

    #grid {
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

        background-color: #DAE0E2;
        border-radius: 3px;
    }

    .square.selected {
        background-color: #002C3E;
        outline: 3px solid #F0981B;
        outline-offset: -2px;
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
        color: #002C3E;
    }

    .square.selected > div > span {
        color: #DAE0E2;
        font-weight: bold;
    }

    button {
        margin-top: 19px;
        width: 100%;
    }
</style>