<script>
    import firebase from 'firebase/app';
    import { navigate } from 'svelte-navaid';

    const auth = firebase.auth();

    let email;
    let password;

    function login() {
        auth.signInWithEmailAndPassword(email, password)
            .then(userToken => {
                navigate('/', true);
            })
            .catch(error => {
                console.error('Error authenticating: ' + error);
            });
    }
</script>

<form on:submit|preventDefault="{login}">
    <input type="email" bind:value="{email}" />
    <input type="password" bind:value="{password}" />
    <input type="submit" value="Login" />
</form>