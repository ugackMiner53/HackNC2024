import * as L from "leaflet";

export let map : L.Map;

export function createMap(mapElement : HTMLDivElement) : L.Map {
    map = L.map(mapElement, {
        minZoom: 3,
        maxBoundsViscosity: 1,
        maxBounds: new L.LatLngBounds(new L.LatLng(90, 180), new L.LatLng(-90, -180)),
        zoomControl: false
    });
    
    map.setView([35.77, -78.68], 17);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
    }).addTo(map);

    map.on("click", handleClick);
    return map;
}

function handleClick(clickEvent : L.LeafletMouseEvent) {
    L.popup().setLatLng(clickEvent.latlng).setContent("ex").openOn(map);
}