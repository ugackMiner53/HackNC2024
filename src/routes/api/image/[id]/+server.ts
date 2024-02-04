import { error, json } from '@sveltejs/kit';
import { isUUID } from '$lib/typecheck.js';
import { DataBase } from '$lib/server/database.js';

export async function GET({ params }) {
  if (!isUUID(params.id)) return error(400, { message: 'invalid param' });

  const img = DataBase.getImage(params.id);
  if (!img) return error(404, { message: 'image not found' });
  return json(img);
}

export async function POST({ params, url }) {
  if (!isUUID(params.id)) return error(400, { message: 'invalid param' });

  const id = url.searchParams.get('id');
  if (isUUID(id)) {
    const rec = DataBase.getRecord(id);
    if (!rec) return error(404, { message: 'record not found' });
    const img = DataBase.getImage(params.id);
    if (!img) return error(404, { message: 'image not found' });
    const ret = DataBase.addImage(rec, img);
    if (!ret) return error(403, { message: 'image already added to another record' });
    return json(ret);
  }

  const img = DataBase.deleteImage(params.id);
  if (!img) return error(404, { message: 'image not found' });

  return json(img);
}
