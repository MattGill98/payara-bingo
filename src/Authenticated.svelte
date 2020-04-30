<script>
	import { derived } from 'svelte/store';
	import firebase, { authStatus } from './config/firebase';

	let authPromise = derived(authStatus, result => {
		if (result) {
			return Promise.resolve(result.authenticated);
		}
		return new Promise(() => {});
	});

	// What to do on a logout
	function logout() {
		firebase.auth().signOut()
			.then(() => navigate('/login', true))
			.catch(error => console.error(error));
	}

	import Route from 'svelte-navaid/Route.svelte';
	import Link from 'svelte-navaid/Link.svelte';
	import { navigate } from 'svelte-navaid';

	import Grid from './routes/Grid.svelte';
	import AdminGrid from './routes/admin/Grid.svelte';
	import Buzzwords from './routes/Buzzwords.svelte';
	import AdminBuzzwords from './routes/admin/Buzzwords.svelte';
	import Results from './routes/Results.svelte';
	import UserInfo from './routes/UserInfo.svelte';
	import Page404 from './routes/404.svelte';
</script>

{#if $authStatus.profileConfigured}
	<Link href="/">Grid</Link>
	<Link href="/buzzwords">Buzzwords</Link>
	<Link href="/results">Results</Link>

	<a href="#logout" on:click|preventDefault="{logout}">Logout</a>

	{#if $authStatus.isAdmin}
		<Route path="/" component="{AdminGrid}" />
		<Route path="/buzzwords" component="{AdminBuzzwords}" />
	{:else}
		<Route path="/" component="{Grid}" />
		<Route path="/buzzwords" component="{Buzzwords}" />
	{/if}
	<Route path="/results" component="{Results}" />
{:else}
	<a href="#logout" on:click|preventDefault="{logout}">Logout</a>
	<Route component="{UserInfo}" />
{/if}
<Route component="{Page404}" />