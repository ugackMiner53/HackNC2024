import { DataBase } from '$lib/server/database.js';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';

export function GET({params}) {
    if (!isUUID(params.id)) {
        return error(400);
    }

    return json(DataBase.getRecord(params.id));
}