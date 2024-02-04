import { DataBase, type PublicRoute } from '$lib/server/database.js';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';

export function GET({ params }) {
  if (!isUUID(params.id)) return error(400, { message: 'invalid param' });

  const rou = DataBase.getRoute(params.id);
  if (!rou) return error(404, { message: 'route not found' });

  return json(rou);
}

export async function POST({ params, url }) {
  if (!isUUID(params.id)) return error(400, { message: 'invalid param' });

  const rou = DataBase.getRoute(params.id);
  if (!rou) return error(404, { message: 'route not found' });

  const name = url.searchParams.get('name');
  const desc = url.searchParams.get('desc');
  const addId = url.searchParams.get('addId');
  const delId = url.searchParams.get('delId');
  const addIndex = url.searchParams.get('addIndex');

  let ret;
  if (name) {
    ret = await DataBase.updateRouteDesc(rou, name);
    if (!ret) return error(400, { message: 'content mod check' });
  }
  if (desc) {
    ret = await DataBase.updateRouteDesc(rou, desc);
    if (!ret) return error(400, { message: 'content mod check' });
  }
  if (isUUID(addId)) {
    let index = undefined;
    if (addIndex !== undefined) {
      index = Number(addIndex);
      if (Number.isNaN(index)) return error(400, { message: 'invalid param' });
    }
    ret = await DataBase.addToRoute(rou, addId, index);
    if (!ret) return error(404, { message: 'record not found' });
  }
  if (isUUID(delId)) {
    ret = await DataBase.deleteFromRoute(rou, delId);
    if (!ret) return error(404, { message: 'record not found' });
  }
  if (ret) return json(ret);

  return json(DataBase.deleteRoute(rou) as PublicRoute);
}
