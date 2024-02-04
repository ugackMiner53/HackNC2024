import { DataBase } from '$lib/server/database';
import { error, json } from '@sveltejs/kit';

export function GET({ url }) {
  const lat = Number(url.searchParams.get('lat'));
  const lon = Number(url.searchParams.get('lon'));

  if (Number.isNaN(lat) || Number.isNaN(lon)) return error(400); // invalid param

  return json(DataBase.getNearby(lat, lon));
}

export async function POST({ url }) {
  const name = url.searchParams.get('name');
  const desc = url.searchParams.get('desc');
  const lat = Number(url.searchParams.get('lat'));
  const lon = Number(url.searchParams.get('lon'));

  if (!name || !desc || Number.isNaN(lat) || Number.isNaN(lon)) return error(400); // invalid param

  const rec = await DataBase.addRecord(lat, lon, name, desc);
  if (!rec) return error(400); // content mod check

  return json(rec);
}
