import { get, writable, type Writable } from 'svelte/store';
import type { PublicImage, PublicRecord, PublicRoute } from './server/database';
import type { UUID } from 'crypto';

export enum INTERACTIVITY_STATES {
  DEFAULT,
  ADD,
  ADD_DETAILS,
  ADD_DETAILS_SUBMITTING,
  VIEW_IMAGES,
  ROUTING
}

interface RecordMarker extends L.Marker {
  _record: PublicRecord;
}

export const interactivityState = writable(INTERACTIVITY_STATES.DEFAULT);
export const activeRecord: Writable<PublicRecord | undefined> = writable(undefined);
export let map: L.Map;
export let selectionMarker: L.Marker | undefined;
export const viewingImages: Writable<PublicImage[] | undefined> = writable(undefined);

const records = new Map<UUID, RecordMarker>();

let markerIcon: L.Icon;
let markerImportantIcon: L.Icon;
let userCircle: L.CircleMarker;
let currRoute: RecordMarker[] = [];

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

export function createMarkerIcon() {
  markerIcon = new L.Icon({
    iconUrl: '/images/marker-icon-2x.png',
    iconSize: [50 / 2, 82 / 2],
    iconAnchor: [50 / 4, 82 / 2],
    shadowSize: [0, 0]
  });
  markerImportantIcon = new L.Icon({
    iconUrl: '/images/marker-important-icon-2x.png',
    iconSize: [50 / 2, 82 / 2],
    iconAnchor: [50 / 4, 82 / 2],
    shadowSize: [0, 0]
  });

  let oldRecord: PublicRecord | undefined;
  activeRecord.subscribe((valid) => {
    if (oldRecord !== undefined) records.get(oldRecord!.uuid)?.setIcon(markerIcon);
    if (valid !== undefined) records.get(valid!.uuid)?.setIcon(markerImportantIcon);
    oldRecord = valid;
  });
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

  selectionMarker?.remove();
  selectionMarker = undefined;

  records.set(record.uuid, marker);
}

function handleMarkerClick(marker: RecordMarker) {
  if (get(interactivityState) === INTERACTIVITY_STATES.ROUTING) {
    currRoute.push(marker);
    marker.setIcon(markerImportantIcon);
    return;
  }
  activeRecord.set(marker._record);
}

export let lastClick: L.LeafletMouseEvent;

function handleClick(clickEvent: L.LeafletMouseEvent) {
  switch (get(interactivityState)) {
    case INTERACTIVITY_STATES.ADD: {
      if (selectionMarker === undefined) {
        selectionMarker = L.marker(clickEvent.latlng, {
          icon: markerIcon,
          opacity: 0.75
        }).addTo(map);
      } else {
        selectionMarker.setLatLng(clickEvent.latlng);
      }
      interactivityState.set(INTERACTIVITY_STATES.ADD_DETAILS);
      break;
    }
  }
  lastClick = clickEvent;
}

export async function createRoute() {
  interactivityState.set(INTERACTIVITY_STATES.DEFAULT);
  if (currRoute.length === 0) return;
  const data: PublicRoute = await (
    await fetch(
      `/api/route?name=${prompt('name')}&desc=${prompt('desc')}&recs=${currRoute.map((v) => v._record.uuid).join(',')}`
    )
  ).json();
  currRoute.forEach((v) => v.setIcon(markerIcon));
  currRoute = [];
}
