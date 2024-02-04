import { DataBase, type PublicRecord } from '$lib/server/database';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';
import type { UUID } from 'crypto';

export function GET({ url }) {
  const lat = Number(url.searchParams.get('lat'));
  const lon = Number(url.searchParams.get('lon'));

  if (Number.isNaN(lat) || Number.isNaN(lon)) return error(400, { message: 'invalid param' });

  return json(DataBase.getNearby(lat, lon));
}

export async function POST({ url }) {
  const name = url.searchParams.get('name');
  const desc = url.searchParams.get('desc');
  const recs = url.searchParams.get('recs');

  if (!name || !desc || !recs) return error(400, { message: 'invalid param' });
  const nodes = recs.split(',');
  if (!nodes.every((v) => isUUID(v))) return error(400, { message: 'invalid param' });
  const nodesR = nodes.map((v) => DataBase.getRecord(v as UUID) as PublicRecord);
  if (!nodesR.every((v) => v)) return error(404, { message: 'invalid param' });

  const route = await DataBase.addRoute(name, desc, ...nodesR);
  if (!route) return error(400, { message: 'content mod check' });

  return json(route);
}
