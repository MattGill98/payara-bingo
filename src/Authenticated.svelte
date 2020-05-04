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

	import Game from './routes/Game.svelte';
	import GameManagement from './routes/GameManagement.svelte';
	import Buzzwords from './routes/Buzzwords.svelte';
	import Results from './routes/Results.svelte';
	import Page404 from './routes/404.svelte';
</script>

<div id="tabs">
	<Link href="/">Game</Link>
	<Link href="/buzzwords">Buzzwords</Link>
	<Link href="/results">Results</Link>
	<Link href="#logout" onclick="{logout}">Logout</Link>
</div>

<div id="content">
	{#if $authStatus.isAdmin}
		<Route path="/" component="{GameManagement}" />
	{:else}
		<Route path="/" component="{Game}" />
	{/if}
	<Route path="/buzzwords" component="{Buzzwords}" />
	<Route path="/results" component="{Results}" />
	<Route component="{Page404}" />
</div>

<svelte:head>
	<style>
		body {
			background-color: #FFFFFF;
		}
	</style>
</svelte:head>

<style>
    #content {
		position: relative;
		padding: 16px 16px 0;
		margin: auto;
		height: 100%;
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