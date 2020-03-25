<script>
    import firebase from 'firebase/app';
    import { navigate } from 'svelte-navaid';

    const auth = firebase.auth();

    let email;
    let password;

    function register() {
        auth.createUserWithEmailAndPassword(email, password)
            .then(userToken => {
                navigate('/', true);
            })
            .catch(error => {
                console.error('Error creating user: ' + error);
            });
    }
</script>

<form on:submit|preventDefault="{register}">
    <input type="email" bind:value="{email}" />
    <input type="password" bind:value="{password}" />
    <input type="submit" value="Register" />
</form>