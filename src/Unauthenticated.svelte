<script>
	import Route from 'svelte-navaid/Route.svelte';
	import Link from 'svelte-navaid/Link.svelte';
	import Login from './routes/Login.svelte';
	import Register from './routes/Register.svelte';
</script>

<Link href="/login">Login</Link>
<Link href="/register">Register</Link>

<Route path="/login" component="{Login}" />
<Route path="/register" component="{Register}" />
<Route component="{Login}" />