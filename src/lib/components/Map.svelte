<script lang="ts">
    import { browser } from "$app/environment";
    import { map } from "$lib/maphandler";
    import { onMount } from "svelte";

    let mapElement : HTMLDivElement;

    onMount(async () => {
        if (browser) {
            const MapHandler = await import("$lib/maphandler");
            MapHandler.createMarkerIcon();
            MapHandler.createMap(mapElement);

            // Get user location
            try {
                const coords = await getCurrentCoords();
                map.setView([coords.latitude, coords.longitude]);
                MapHandler.drawCurrentPosition(coords.latitude, coords.longitude);
            } catch(err) {}
        }
    })

    function getCurrentCoords() : Promise<GeolocationCoordinates> {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition((pos) => res(pos.coords), (err) => rej(err));
        })
    }
</script>

<link rel="stylesheet" href="/leaflet.css" />

<style>
    .map {
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }
</style>

<div class="map" bind:this={mapElement} />