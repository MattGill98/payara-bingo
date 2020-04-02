<script>
    import { buzzwords, addBuzzword } from '../../config/firebase';

    let input;
    function submit() {
        addBuzzword(input);
        input = "";
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
                <td>{item.val}</td>
                <td><button type="button">Select</button></td>
                <td><button type="button">Deselect</button></td>
                <td><button type="button" on:click="{item.remove}">Remove</button></td>
            </tr>
        {/each}
    </tbody>
</table>

<form on:submit|preventDefault="{submit}">
    <input type="text" bind:value="{input}" />
    <input type="submit" value="Submit" />
</form>