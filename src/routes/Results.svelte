<script>
    import { currentGameResults, previousGameResults } from '../config/firebase';
</script>

<h1>Current Game</h1>

<pre>{JSON.stringify($currentGameResults)}</pre>

<h1>Previous Game</h1>

<pre>{JSON.stringify($previousGameResults)}</pre>