import { DataBase } from "$lib/server/database";
import { error, json } from "@sveltejs/kit";

export function GET({ url }) {
    const lat = Number(url.searchParams.get("lat"));
    const lon = Number(url.searchParams.get("lon"));

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return error(400);
    }

    return json(DataBase.getNearby(lat, lon));
}

export async function POST({url}) {
    const name = url.searchParams.get("name");
    const desc = url.searchParams.get("desc");
    const lat = Number(url.searchParams.get("lat"));
    const lon = Number(url.searchParams.get("lon"));

    if (!name || !desc || Number.isNaN(lat) || Number.isNaN(lon)) {
        return error(400);
    }

    const record = await DataBase.addRecord(lat, lon, name, desc);
    if (!record) {
        // Failed content moderation check
        return error(400);
    }
    
    return json(record)
}