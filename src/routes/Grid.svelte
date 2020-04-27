<script>
    import { myGrid, submitGrid } from '../config/firebase';
</script>

<div>
{#if !$myGrid}
    <p>There is no active game.</p>
{:else}
    {#each $myGrid as item}
        <p on:click="{item.select}">
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