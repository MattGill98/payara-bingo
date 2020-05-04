<script>
	import Route from 'svelte-navaid/Route.svelte';
	import Link from './components/Link.svelte';

	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
    import firebase from 'firebase/app';
    import { navigate } from 'svelte-navaid';

    const auth = firebase.auth();

    let email;
	let password;
	let confirmpassword;
	let displayname;

	let isRegisterPage = derived(getContext('navaid').active, active => {
		return active && active.path === '/register';
	});

	let errorMessage;

	let success = () => {
		errorMessage = undefined;
		navigate('/', true);
	};

	let failure = (error, message) => {
		console.error('Authentication error: ' + error);
		errorMessage = message;
	};

	function register() {
        if (email && password && password === confirmpassword) {
			auth.createUserWithEmailAndPassword(email, password)
				.then(() => auth.currentUser.updateProfile({ displayName: displayname }))
				.then(() => auth.currentUser.getIdToken(true))
                .then(success)
				.catch(error => failure(error, 'Registration failed'));
        } else {
            errorMessage = "The passwords don't match";
        }
	}
	
	function login() {
        if (email && password) {
			auth.signInWithEmailAndPassword(email, password)
				.then(success)
				.catch(error => failure(error, 'Authentication failed'));
		} else {
			errorMessage = "Enter an email and password";
		}
	}
</script>

<div id="content">
	<div id="tabs">
		<Link defaultLink href="/login">Login</Link>
		<Link href="/register">Register</Link>
	</div>

	<form on:submit|preventDefault="{$isRegisterPage? register : login}">
		<input type="email" bind:value="{email}" placeholder="Email" />
		<input type="password" bind:value="{password}" placeholder="Password" />
		<Route path="/register">
			<input type="password" bind:value="{confirmpassword}" placeholder="Confirm Password" />
			<input type="text" bind:value="{displayname}" placeholder="Display name" />
		</Route>

		{#if errorMessage}
			<div id="error"><span>{errorMessage}</span></div>
		{/if}

		<input type="submit" value="{$isRegisterPage? 'Register' : 'Login'}" />
	</form>
</div>

<svelte:head>
	<style>
		body {
			background-color: #002C3E;
		}
	</style>
</svelte:head>

<style>
	#content {
		top: 20%;
		margin: auto;
		width: fit-content;
		position: relative;
	}

	#tabs {
		padding: 0 7px;

		display: flex;
		justify-content: space-around;
	}

	form {
		background-color: #0076A84D;
		display: flex;
		flex-flow: column nowrap;
		padding: 7px;
		border-radius: 3px;
	}

	form > * {
		margin-top: 32px;
	}
</style>