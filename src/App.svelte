{#await authPromise}
	<p>Loading...</p>
{:then authPromiseResult}
	<Router>
		{#if $authenticated}
			<Link href="/">Grid</Link>
			<Link href="/buzzwords">Buzzwords</Link>
			<Link href="/results">Results</Link>
			<a href="#logout" on:click|preventDefault="{logout}">Logout</a>

			<Route path="/" component="{Grid}" />
			<Route path="/buzzwords" component="{Buzzwords}" />
			<Route path="/results" component="{Results}" />
			<Route component="{Page404}" />
		{:else}
			<Link href="/login">Login</Link>
			<Link href="/register">Register</Link>

			<Route path="/login" component="{Login}" />
			<Route path="/register" component="{Register}" />
			<Route component="{Login}" />
		{/if}
	</Router>
{/await}

<script>
	import firebase, { authenticated } from './config/firebase';

	const auth = firebase.auth();

	// Get if the user is authenticated, and update this variable whenever it changes
	$: authPromise = $authenticated === undefined?
			new Promise(() => {}) :
			Promise.resolve($authenticated);

	// What to do on a logout
	function logout() {
		auth.signOut()
			.then(() => navigate('/login', true))
			.catch(error => console.error(error));
	}

	import Router from 'svelte-navaid/Router.svelte';
	import Route from 'svelte-navaid/Route.svelte';
	import Link from 'svelte-navaid/Link.svelte';
	import { navigate } from 'svelte-navaid';

	import Grid from './routes/Grid.svelte';
	import Buzzwords from './routes/Buzzwords.svelte';
	import Results from './routes/Results.svelte';
	import Login from './routes/Login.svelte';
	import Register from './routes/Register.svelte';
	import Page404 from './routes/404.svelte';
</script>