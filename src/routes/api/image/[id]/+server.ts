import { readFile } from 'fs/promises';
import { error } from '@sveltejs/kit';
import { isUUID } from '$lib/typecheck.js';

export async function GET({ params }) {
    if (!isUUID(params.id)) {
        return error(400);
    }

    try {
        const image = await readFile(`./src/lib/bucket/${params.id}.img`);
        return new Response(image, {
            headers: {
                "Content-Type": "image/png",
                "Content-Length": image.byteLength.toString()
            }
        });
    } catch (ex) {
        return error(404);
    }
}