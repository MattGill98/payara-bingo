<script>
    import { buzzwords, addBuzzword } from '../config/firebase';

    let input;
    function submit() {
        addBuzzword(input);
        input = "";
    }
</script>

{#each $buzzwords as item}
    <div><p>{item.val.text}</p></div>
{/each}

<form on:submit|preventDefault="{submit}">
    <input type="text" bind:value="{input}" />
    <input type="submit" value="Submit" />
</form>