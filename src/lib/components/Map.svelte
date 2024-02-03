<script lang="ts">
    import { browser } from "$app/environment";
    import { createMap } from "$lib/maphandler";
    import { onMount } from "svelte";

    let mapElement : HTMLDivElement;

    onMount(async () => {
        if (browser) {
            createMap(mapElement);
        }
    })
</script>

<style>
    #map {
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }
</style>

<div id="map" bind:this={mapElement} />