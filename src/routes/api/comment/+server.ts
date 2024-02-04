import { DataBase } from '$lib/server/database';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';
import type { UUID } from 'crypto';

export async function POST({ url }) {
    const id = url.searchParams.get('id');
    const text = url.searchParams.get('text');

    if (!text || !isUUID(id)) return error(400, { message: 'invalid params' });
    const rec = DataBase.getRecord(id);
    if (!rec) return error(404, { message: 'record not found' });

    const com = await DataBase.addComment(rec, text);
    if (!com) return error(400, { message: 'content mod check' });

    return json(com);
}

export async function GET({ url }) {
  if (!url.searchParams.has('ids')) return error(400, { message: 'invalid param' });
  const ids = (url.searchParams.get('ids') as string).split(',');
  if (!ids.every((v) => isUUID(v))) return error(400, { message: 'invalid param' });
  const comms = ids.map(v => DataBase.getComment(v as UUID));
  if (!comms.every((v) => v)) return error(404, { message: 'invalid param' });

  return json(comms);
}