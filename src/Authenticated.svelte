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
	import Link from './components/Link.svelte';
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
	<div id="tabs">
		<Link href="/">Grid</Link>
		<Link href="/buzzwords">Buzzwords</Link>
		<Link href="/results">Results</Link>
		<Link href="#logout" onclick="{logout}">Logout</Link>
	</div>

	<div id="content">
		{#if $authStatus.isAdmin}
			<Route path="/" component="{AdminGrid}" />
			<Route path="/buzzwords" component="{AdminBuzzwords}" />
		{:else}
			<Route path="/" component="{Grid}" />
			<Route path="/buzzwords" component="{Buzzwords}" />
		{/if}
		<Route path="/results" component="{Results}" />
	</div>
{:else}
	<Link href="#logout" onclick="{logout}">Logout</Link>
	<Route component="{UserInfo}" />
{/if}
<Route component="{Page404}" />

<svelte:head>
	<style>
		body {
			background-color: #FFFFFF;
		}
	</style>
</svelte:head>

<style>
    #content {
		padding: 0 16px;
		margin: auto;
		width: 100%;
		box-sizing: border-box;
		max-width: 500px;
		text-align: center;
	}

	#tabs {
		background-color: #002C3E;

		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
		height: 10%;
		align-items: flex-end;
	}
</style>