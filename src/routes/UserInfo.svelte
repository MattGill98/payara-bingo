<script>
    import firebase, { profileConfigured } from '../config/firebase';
    import { navigate } from 'svelte-navaid';

    const user = firebase.auth().currentUser;

    let displayname;

    function submit() {
        user.updateProfile({
            displayName: displayname
        }).then(userToken => {
            user.getIdToken(true);
            navigate('/', true);
        }).catch(error => {
            console.error('Error setting display name: ' + error);
        });
    }
</script>

<p>Before you continue, you must define a display name. This will appear to other users.</p>
<form on:submit|preventDefault="{submit}">
    <input type="text" bind:value="{displayname}" />
    <input type="submit" value="Save" />
</form>