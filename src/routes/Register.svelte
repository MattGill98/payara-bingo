<script>
    import firebase from 'firebase/app';
    import { navigate } from 'svelte-navaid';

    const auth = firebase.auth();

    function register() {
        let email = event.target.email.value;
        let password = event.target.password.value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(userToken => {
                console.log(userToken);
                navigate('/', true);
            })
            .catch(error => {
                console.error('Error creating user: ' + error);
            });
    }
</script>

<form on:submit|preventDefault="{register}">
    <input name="email" type="email" />
    <input name="password" type="password" />
    <input type="submit" value="Register" />
</form>