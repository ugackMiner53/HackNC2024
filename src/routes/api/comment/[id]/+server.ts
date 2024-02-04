import { DataBase } from '$lib/server/database.js';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';

export function GET({ params }) {
  if (!isUUID(params.id)) return error(400, { message: 'invalid param' });

  const com = DataBase.getComment(params.id);
  if (!com) return error(404, { message: 'comment not found' });

  return json(com);
}

export async function POST({ params }) {
  if (!isUUID(params.id)) return error(400, { message: 'invalid param' });

  const com = DataBase.deleteComment(params.id);
  if (!com) return error(404, { message: 'comment not found' });

  return json(com);
}
