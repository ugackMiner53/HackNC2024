<script lang="ts">
    import Map from "$lib/components/Map.svelte";
    import Toolbar from "$lib/components/Toolbar.svelte";

    let showToolbar = true;
</script>

<style>
    :global(body) {
        background-color: red;
    }
</style>

<link rel="stylesheet" href="/leaflet.css" />

<!-- <h1 style="position: absolute; z-index: 999;">Hello </h1> -->

<button on:click={() => {showToolbar = !showToolbar}} style="position: absolute; right:0;"> reversi</button>

<!-- If show toolbar -->
{#if showToolbar}
<!-- Toolbar would go here -->
    <Toolbar />
{:else}
<!-- Else show menu -->

{/if}

<!-- Search bar -->

<!-- <Map /> -->