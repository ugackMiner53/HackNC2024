import { readFile } from 'fs/promises';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
    if (!/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(params.id)) {
        console.log("FRICK YOU");
        return error(400);
    }
    console.log("ILY")

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