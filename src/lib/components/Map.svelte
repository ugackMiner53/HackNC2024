<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let mapElement : HTMLDivElement;

    onMount(async () => {
        if (browser) {
            const MapHandler = await import("$lib/maphandler");
            MapHandler.createMap(mapElement);
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