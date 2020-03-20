<script>
    let value;

    import firebase from 'firebase/app';

    let valueRef = firebase.database().ref('test-value');
    valueRef.on('value', v => {
        value = v.val();
    });

    function handlePost(event) {
        valueRef.set(event.target.input.value);
    }
</script>

<p>Home Page</p>

<p>Value: {value}</p>

<form on:submit|preventDefault="{handlePost}">
    <input name="input" />
    <input type="submit" value="Submit" />
</form>