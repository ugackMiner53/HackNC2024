import { DataBase } from '$lib/server/database';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ url }) {
  const id = url.searchParams.get('id');
  const text = url.searchParams.get('text');

  if (!text || !isUUID(id)) return error(400); // invalid params
  const rec = DataBase.getRecord(id);
  if (!rec) return error(404); // record not found

  const com = await DataBase.addComment(rec, text);
  if (!com) return error(400); // content mod check

  return json(com);
}
