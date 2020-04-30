<script>
	import { derived } from 'svelte/store';
	import { authStatus } from './config/firebase';

	let authPromise = derived(authStatus, result => {
		if (result) {
			return Promise.resolve(result.authenticated);
		}
		return new Promise(() => {});
	});

	import Router from 'svelte-navaid/Router.svelte';
	import Route from 'svelte-navaid/Route.svelte';
	import Link from 'svelte-navaid/Link.svelte';

	import Authenticated from './Authenticated.svelte';
	import Unauthenticated from './Unauthenticated.svelte';
	import Page404 from './routes/404.svelte';
</script>

{#await $authPromise}
	<p>Loading...</p>
{:then authPromiseResult}
	<Router>
		{#if authPromiseResult}
			<Authenticated />
		{:else}
			<Unauthenticated />
		{/if}
		<Route component="{Page404}" />
	</Router>
{/await}