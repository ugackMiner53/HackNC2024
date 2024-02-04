import * as L from "leaflet";

export let map : L.Map;

let markerIcon : L.Icon;

let userCircle : L.CircleMarker;

export function createMap(mapElement : HTMLDivElement) : L.Map {
    map = L.map(mapElement, {
        minZoom: 3,
        maxBoundsViscosity: 1,
        maxBounds: new L.LatLngBounds(new L.LatLng(90, 180), new L.LatLng(-90, -180)),
        zoomControl: false
    });
    
    map.setView([0, 0], 17);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
    }).addTo(map);

    map.on("click", handleClick);
    return map;
}

export function createMarkerIcon() : L.Icon {
    return new L.Icon({
        iconUrl: "/images/marker-icon-2x.png",
        iconSize: [50/2, 82/2],
        iconAnchor: [50/4, 82/2],
        shadowSize: [0, 0]
    });
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


function handleClick(clickEvent : L.LeafletMouseEvent) {

    // Assume the user is always in add mode
    const marker = L.marker(clickEvent.latlng, {icon: markerIcon}).addTo(map);
    marker.on("click", (clickEvent : L.LeafletMouseEvent) => {
        L.popup().setLatLng(clickEvent.latlng).setContent("Hi").addTo(map);
    })

    // L.popup().setLatLng(clickEvent.latlng).setContent("ex").openOn(map);
}