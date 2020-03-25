<script>
    import { buzzwords } from '../config/firebase';
</script>

<div>
{#each Array(9) as _, i}
    <div><p>{$buzzwords[i]}</p></div>
{/each}
</div>