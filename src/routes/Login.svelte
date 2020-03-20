<script>
    import firebase from 'firebase/app';
    import { navigate } from 'svelte-navaid';

    const auth = firebase.auth();

    function login() {
        let email = event.target.email.value;
        let password = event.target.password.value;

        auth.signInWithEmailAndPassword(email, password)
            .then(userToken => {
                console.log(userToken);
                navigate('/', true);
            })
            .catch(error => {
                console.error('Error authenticating: ' + error);
            });
    }
</script>

<form on:submit|preventDefault="{login}">
    <input name="email" type="email" />
    <input name="password" type="password" />
    <input type="submit" value="Login" />
</form>