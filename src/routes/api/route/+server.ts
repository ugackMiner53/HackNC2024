import { DataBase, type PublicRecord } from '$lib/server/database';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';
import type { UUID } from 'crypto';

export async function GET({ url }) {
  if (!url.searchParams.has('ids')) return error(400, { message: 'invalid param' });
  const ids = (url.searchParams.get('ids') as string).split(',');
  if (!ids.every((v) => isUUID(v))) return error(400, { message: 'invalid param' });
  const routs = ids.map(v => DataBase.getRoute(v as UUID));
  if (!routs.every((v) => v)) return error(404, { message: 'invalid param' });

  return json(routs);
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
