<script>
    import { buzzwords, addBuzzword, authStatus } from '../config/firebase';

    let input;
    function submit() {
        addBuzzword(input);
        input = "";
    }
</script>

<form on:submit|preventDefault="{submit}">
    <input type="text" bind:value="{input}" />
    <input type="submit" value="Submit" />
</form>

<ul>
    {#each $buzzwords as item}
        {#if $authStatus.isAdmin}
            <li class="selectable" on:click="{item.select}" class:selected="{item.selected}">
                {#if item.author}
                    <span>[{item.author}]</span> <br />
                {/if}
                <span>{item.text}</span>
                <button type="button" on:click="{item.remove}"><span>Remove</span></button>
            </li>
        {:else}
            <li class="selectable" class:selected="{item.selected}">
                <span>{item.text}</span>
            </li>
        {/if}
    {/each}
</ul>

<style>
    input[type="text"] {
        width: 100%;
    }
    input[type="submit"] {
        margin-left: 7px;
    }

    form {
        display: flex;
    }
</style>