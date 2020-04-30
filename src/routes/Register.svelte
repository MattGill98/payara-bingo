<script>
    import firebase from 'firebase/app';
    import { navigate } from 'svelte-navaid';

    const auth = firebase.auth();

    let email;
    let password;
    let confirmpassword;

    function register() {
        if (password === confirmpassword) {
            auth.createUserWithEmailAndPassword(email, password)
                .then(userToken => {
                    navigate('/', true);
                })
                .catch(error => {
                    console.error('Error creating user: ' + error);
                });
        } else {
            throw new Error("passwords don't match");
        }
    }
</script>

<form on:submit|preventDefault="{register}">
    <input type="email" bind:value="{email}" placeholder="Email" />
    <input type="password" bind:value="{password}" placeholder="Password" />
    <input type="password" bind:value="{confirmpassword}" placeholder="Confirm Password" />
    <input type="submit" value="Register" />
</form>