import { get, writable } from "svelte/store";
import type { PublicRecord } from "./server/database";

export enum INTERACTIVITY_STATES {
    DEFAULT,
    ADD,
    ADD_DETAILS,
    ADD_DETAILS_SUBMITTING
}

export const interactivityState = writable(INTERACTIVITY_STATES.DEFAULT);
export let map : L.Map;

let markerIcon : L.Icon;
let userCircle : L.CircleMarker;

let L : typeof import("leaflet");

export async function importLeaflet() {
    L = await import("leaflet");
}

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

export function createMarkerIcon() : L.Icon {
    markerIcon = new L.Icon({
        iconUrl: "/images/marker-icon-2x.png",
        iconSize: [50/2, 82/2],
        iconAnchor: [50/4, 82/2],
        shadowSize: [0, 0]
    });
    return markerIcon;
}

export function drawCurrentPosition(lat : number, lon : number) {
    if (!userCircle) {
        userCircle = L.circleMarker({lat, lng: lon}, {
            radius: 10,
            color: "blue"
        }).addTo(map);
    } else {
        userCircle.setLatLng({lat, lng: lon});
    }
}

export function createRecordMarker(record : PublicRecord) {
    const marker = L.marker({lat: record.lat, lng: record.lon}, {
        interactive: true,
        icon: markerIcon
    }).addTo(map);
    marker.on("click", () => handleMarkerClick(marker));
}

function handleMarkerClick(marker : L.Marker) {
    L.popup({
        content: "This is a thingy",
    }).setLatLng(marker.getLatLng());
}

export let lastClick : L.LeafletMouseEvent;

function handleClick(clickEvent : L.LeafletMouseEvent) {
    switch (get(interactivityState)) {
        case INTERACTIVITY_STATES.ADD: {
            L.marker(clickEvent.latlng, {icon: markerIcon}).addTo(map); // This needs to be removed later... but how?
            interactivityState.set(INTERACTIVITY_STATES.ADD_DETAILS);
            break;
        }
    }
    lastClick = clickEvent;
}