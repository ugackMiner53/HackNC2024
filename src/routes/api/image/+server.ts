import { DataBase, type PublicImage } from '$lib/server/database';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ url, request }) {
  const formData = Object.fromEntries(await request.formData());

  if (!(formData.fileToUpload as File).name || (formData.fileToUpload as File).name === 'undefined') return error(400); // no file uploaded

  const { fileToUpload } = formData as { fileToUpload: File };
  const img = await DataBase.uploadImage(Buffer.from(await fileToUpload.arrayBuffer()), '.img');
  if (!img) return error(400); // content mod check

  const id = url.searchParams.get('id');
  if (isUUID(id)) {
    const rec = DataBase.getRecord(id);
    if (!rec) return error(404); // record not found
    return json(DataBase.addImage(rec, img) as PublicImage);
  }

  return json(img);
}
