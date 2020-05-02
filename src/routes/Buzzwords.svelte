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

    ul {
        list-style: none;
        padding: 0;
        overflow-y: auto;
    }

    li {
        position: relative;
        padding: 7px;
        margin-bottom: 2%;
    }

    li > span {
        vertical-align: middle;
    }

    li > button {
        position: absolute;
        height: 100%;
        right: 0;
        top: 0;

        background: rgba(0,0,0,0.2);
        border: 0;
        border-radius: 0 3px 3px 0;
    }

    li > button:hover {
        background: rgba(0,0,0,0.4);
    }

    li.selected > button {
        top: 0.5px;
        height: calc(100% - 1px);
        border-radius: 0;
    }
</style>