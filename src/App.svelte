{#await authPromise}
	<p>Loading...</p>
{:then authPromiseResult}
	<Router>
		{#if authenticated}
			<Link href="/">Home</Link>
			<Link href="/help">Help</Link>
			<a href="#logout" on:click|preventDefault="{logout}">Logout</a>

			<Route path="/" component="{Home}" />
			<Route path="/help" component="{Help}" />
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
	import firebase from './config/firebase';
	firebase.initialise();

	const auth = firebase.auth();

	// Get if the user is authenticated, and update this variable whenever it changes
	let authenticated = null;
	auth.onAuthStateChanged(user => {
		if (user) {
			console.log('Authenticated');
			authenticated = true;
		} else {
			console.log('Unauthenticated');
			authenticated = false;
		}
	});
	$: authPromise = authenticated === null?
			new Promise(() => {}) :
			Promise.resolve(authenticated);

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

	import Home from './routes/Home.svelte';
	import Help from './routes/Help.svelte';
	import Login from './routes/Login.svelte';
	import Register from './routes/Register.svelte';
	import Page404 from './routes/404.svelte';
</script>