<script lang="ts">
    // import { writable } from "svelte/store";
    
    let thing = false;

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>Thing is {thing}</p>
<button on:click={() => {thing = !thing;}}>click me</button>