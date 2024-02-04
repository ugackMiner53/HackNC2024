<script lang="ts">
    import { browser } from "$app/environment";
    import { INTERACTIVITY_STATES, interactivityState } from "$lib/maphandler";
    import { onMount } from "svelte";

    let mapElement : HTMLDivElement;

    onMount(async () => {
        if (browser) {
            const MapHandler = await import("$lib/maphandler");
            await MapHandler.importLeaflet();
            MapHandler.createMarkerIcon();
            MapHandler.createMap(mapElement);

            // Get user location
            try {
                const coords = await getCurrentCoords();
                MapHandler.map.setView([coords.latitude, coords.longitude]);
                MapHandler.drawCurrentPosition(coords.latitude, coords.longitude);
            } catch(err) {}
        }
    })

    function getCurrentCoords() : Promise<GeolocationCoordinates> {
        return new Promise((res, rej) => {
            if (browser) {
                navigator.geolocation.getCurrentPosition((pos) => res(pos.coords), (err) => rej(err));
            }
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
        box-sizing: border-box;
    }
</style>

{#if $interactivityState === INTERACTIVITY_STATES.ADD}
    <style>
        .map {
            border: 5px dashed purple;
        }
    </style>
{/if}

<div class="map" bind:this={mapElement} />