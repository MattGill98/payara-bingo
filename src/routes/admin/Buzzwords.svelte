<script>
    import { buzzwords, addBuzzword } from '../../config/firebase';

    let input;
    function submit() {
        if (input) {
            addBuzzword(input);
            input = "";
        }
    }
</script>

<table>
    <thead>
        <th>Buzzword</th>
        <th></th>
        <th></th>
        <th></th>
    </thead>
    <tbody>
        {#each $buzzwords as item}
            <tr>
                <td on:click="{item.select}">
                    {#if item.selected}
                        <strong>{item.text}</strong>
                    {:else}
                        {item.text}
                    {/if}
                </td>
                <td><button type="button" on:click="{item.remove}">Remove</button></td>
            </tr>
        {/each}
    </tbody>
</table>

<form on:submit|preventDefault="{submit}">
    <input type="text" bind:value="{input}" />
    <input type="submit" value="Submit" />
</form>