import { get, writable, type Writable } from 'svelte/store';
import type { PublicImage, PublicRecord } from './server/database';
import type { UUID } from 'crypto';

export enum INTERACTIVITY_STATES {
  DEFAULT,
  ADD,
  ADD_DETAILS,
  ADD_DETAILS_SUBMITTING,
  VIEW_IMAGES
}

interface RecordMarker extends L.Marker {
  _record: PublicRecord;
}

export const interactivityState = writable(INTERACTIVITY_STATES.DEFAULT);
export const activeRecord: Writable<PublicRecord | undefined> = writable(undefined);
export let map: L.Map;
export let selectionMarker: L.Marker;
export let viewingImages: PublicImage[] | undefined;

const records = new Set<UUID>();

let markerIcon: L.Icon;
let userCircle: L.CircleMarker;

let L: typeof import('leaflet');

export async function importLeaflet() {
  L = await import('leaflet');
}

export function createMap(mapElement: HTMLDivElement): L.Map {
  map = L.map(mapElement, {
    minZoom: 3,
    maxBoundsViscosity: 1,
    maxBounds: new L.LatLngBounds(new L.LatLng(90, 180), new L.LatLng(-90, -180)),
    zoomControl: false
  });

  map.setView([35.77, -78.68], 17);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  map.on('click', handleClick);
  map.on('dragend', loadRecordsInView);
  loadRecordsInView();
  return map;
}

export function createMarkerIcon(): L.Icon {
  markerIcon = new L.Icon({
    iconUrl: '/images/marker-icon-2x.png',
    iconSize: [50 / 2, 82 / 2],
    iconAnchor: [50 / 4, 82 / 2],
    shadowSize: [0, 0]
  });
  return markerIcon;
}

export function drawCurrentPosition(lat: number, lon: number) {
  if (!userCircle) {
    userCircle = L.circleMarker(
      { lat, lng: lon },
      {
        radius: 10,
        color: 'blue'
      }
    ).addTo(map);
  } else {
    userCircle.setLatLng({ lat, lng: lon });
  }
}

async function loadRecordsInView() {
  const { lat, lng: lon } = map.getCenter();
  const localRecords: PublicRecord[] = await (await fetch(`/api/record?lat=${lat}&lon=${lon}`)).json();
  for (const record of localRecords) {
    if (!records.has(record.uuid)) createRecordMarker(record);
  }
}

export function createRecordMarker(record: PublicRecord) {
  const marker: RecordMarker = Object.assign(
    L.marker(
      { lat: record.lat, lng: record.lon },
      {
        interactive: true,
        icon: markerIcon
      }
    ),
    { _record: record }
  );

  marker.on('click', () => handleMarkerClick(marker));
  marker.addTo(map);

  records.add(record.uuid);
}

function handleMarkerClick(marker: RecordMarker) {
  activeRecord.set(marker._record);
}

export let lastClick: L.LeafletMouseEvent;

function handleClick(clickEvent: L.LeafletMouseEvent) {
  switch (get(interactivityState)) {
    case INTERACTIVITY_STATES.ADD: {
      selectionMarker = L.marker(clickEvent.latlng, {
        icon: markerIcon,
        opacity: 0.75
      }).addTo(map); // This needs to be removed later... but how?
      interactivityState.set(INTERACTIVITY_STATES.ADD_DETAILS);
      break;
    }
  }
  lastClick = clickEvent;
}
