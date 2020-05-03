<script>
    import { getContext } from 'svelte';
    import { derived } from 'svelte/store';
    import Link from 'svelte-navaid/Link.svelte';
    
    export let defaultLink = false;
    export let href;
    export let onclick = undefined;

    function handleClick(event) {
        if (onclick) {
            event.preventDefault();
            onclick(event);
        }
    }

    let active = derived(getContext('navaid').active, contextActive => {
        if (!contextActive || !contextActive.path) return Boolean(defaultLink);
        return contextActive.path === href;
    });
</script>

<div on:click="{handleClick}" aria-current="{$active? true : undefined}">
    <Link href="{href}"><slot /></Link>
</div>

<style>
    div {
        position: relative;
        padding: 7px 10px;
        margin: 0;
        z-index: 1;
    }

    [aria-current]::after {
        z-index: -1;
        position: absolute;
		content: '';
		width: 100%;
		height: 100%;
        border-radius: 3px 3px 0 0;
        background-color: #0076A84D;
		display: block;
        bottom: 0px;
        left: 0px;
    }
</style>