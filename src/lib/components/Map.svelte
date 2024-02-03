<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let map : L.Map;
    let mapElement : HTMLDivElement;

    onMount(async () => {
        const L = await import("leaflet");

        if (browser) {
            map = L.map(mapElement).setView([51.505, -0.09], 13);
    
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
            }).addTo(map);

            map.on("click", (click) => {
                L.popup().setLatLng(click.latlng).setContent("Clicked!").openOn(map);
            })
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