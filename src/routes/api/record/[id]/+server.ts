import { DataBase, type PublicRecord } from '$lib/server/database.js';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';

export function GET({ params }) {
  if (!isUUID(params.id)) return error(400, { message: 'invalid param' });

  const rec = DataBase.getRecord(params.id);
  if (!rec) return error(404, { message: 'record not found' });

  return json(rec);
}

export async function POST({ params, url }) {
  if (!isUUID(params.id)) return error(400, { message: 'invalid param' });

  const rec = DataBase.getRecord(params.id);
  if (!rec) return error(404, { message: 'record not found' });

  const name = url.searchParams.get('name');
  const desc = url.searchParams.get('desc');

  let ret;
  if (name) {
    ret = await DataBase.updateRecordName(rec, name);
    if (!ret) return error(400, { message: 'content mod check' });
  }
  if (desc) {
    ret = await DataBase.updateRecordDesc(rec, desc);
    if (!ret) return error(400, { message: 'content mod check' });
  }
  if (ret) return json(ret);

  return json(DataBase.deleteRecord(rec) as PublicRecord);
}
