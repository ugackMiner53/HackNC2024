import { DataBase, type PublicImage } from '$lib/server/database';
import { isUUID } from '$lib/typecheck.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ url, request }) {
  const formData = Object.fromEntries(await request.formData());

  if (!formData.imageToUpload || !(formData.imageToUpload as File).name || (formData.imageToUpload as File).name === 'undefined')
    return error(400, { message: 'no file uploaded' });

  const { imageToUpload } = formData as { imageToUpload: File };
  const img = await DataBase.uploadImage(Buffer.from(await imageToUpload.arrayBuffer()), '.png');
  if (!img) return error(400, { message: 'content mod check' });

  const id = url.searchParams.get('id');
  if (isUUID(id)) {
    const rec = DataBase.getRecord(id);
    if (!rec) return error(404, { message: 'record not found' });
    return json(DataBase.addImage(rec, img) as PublicImage);
  }

  return json(img);
}
