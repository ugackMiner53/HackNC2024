import { DataBase } from '$lib/server/database';
import { error, json } from '@sveltejs/kit';

export function GET({ url }) {
  const lat = Number(url.searchParams.get('lat')) + 90;
  const lon = Number(url.searchParams.get('lon')) + 180;

  if (Number.isNaN(lat) || Number.isNaN(lon)) return error(400, { message: 'invalid param' });

  return json(DataBase.getNearby(lat, lon));
}

export async function POST({ url }) {
  const name = url.searchParams.get('name');
  const desc = url.searchParams.get('desc');
  const lat = Number(url.searchParams.get('lat')) + 90;
  const lon = Number(url.searchParams.get('lon')) + 180;

  if (!name || !desc || Number.isNaN(lat) || Number.isNaN(lon)) return error(400, { message: 'invalid param' });

  const rec = await DataBase.addRecord(lat, lon, name, desc);
  if (!rec) return error(400, { message: 'content mod check' });

  return json(rec);
}
