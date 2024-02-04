import { dist } from '$lib/coordinates';
import analyzeImage from '$lib/imageanalyze';
import analyzeComment from '$lib/commentanalyze';
import { existsSync, readFileSync, writeFile } from 'fs';
import { writeFile as writeFileP } from 'fs/promises';
import { randomUUID, type UUID } from 'crypto';

interface Record {
  uuid: UUID;
  lat: number;
  lon: number;
  name: string;
  desc: string;
  images: UUID[];
  comments: UUID[];
  routes: UUID[];
}
export type PublicRecord = Readonly<Record>;
interface Route {
  uuid: UUID;
  nodes: UUID[];
  name: string;
  desc: string;
}
export type PublicRoute = Readonly<Route>;
interface Comment {
  uuid: UUID;
  ruuid?: UUID;
  text: string;
}
export type PublicComment = Readonly<Comment>;
interface Image {
  uuid: UUID;
  ruuid?: UUID;
  path: string;
  ext: string;
}
export type PublicImage = Readonly<Image>;

// trust trust
const STORAGE_PATH: string = './data.json';
const IMAGE_PATH: string = './bucket/';
const THRESHOLD = 0.5;
let needSave: boolean = true;

let data: {
  cells: UUID[][][];
  records: { [x: UUID]: Record };
  routes: { [x: UUID]: Route };
  comments: { [x: UUID]: Comment };
  images: { [x: UUID]: Image };
};
function trySave() {
  if (needSave) setTimeout(() => save(), 1 /*60_000*/);
  needSave = false;
}
function save() {
  needSave = true;
  writeFile(STORAGE_PATH, JSON.stringify(data), () => {});
}
function load() {
  if (existsSync(STORAGE_PATH)) data = JSON.parse(readFileSync(STORAGE_PATH).toString());
  else {
    data = {
      cells: new Array(180).fill(0).map(() => new Array(360).fill(0).map(() => [])),
      records: {},
      routes: {},
      comments: {},
      images: {}
    };
    save();
  }
}
load();
function eucMod(n: number, m: number): number {
  const a = n % m;
  return a < 0 ? a + m : a;
}
function getRecords(lat: number, lon: number): UUID[] {
  lat = ~~lat;
  lon = ~~lon;
  return data.cells[lat][lon];
}
function getNearbyRecords(lat: number, lon: number): UUID[] {
  return [
    getRecords(eucMod(lat - 1, 180), eucMod(lon - 1, 360)),
    getRecords(eucMod(lat - 1, 180), eucMod(lon + 0, 360)),
    getRecords(eucMod(lat - 1, 180), eucMod(lon + 1, 360)),
    getRecords(eucMod(lat + 0, 180), eucMod(lon - 1, 360)),
    getRecords(eucMod(lat + 0, 180), eucMod(lon + 0, 360)),
    getRecords(eucMod(lat + 0, 180), eucMod(lon + 1, 360)),
    getRecords(eucMod(lat + 1, 180), eucMod(lon - 1, 360)),
    getRecords(eucMod(lat + 1, 180), eucMod(lon + 0, 360)),
    getRecords(eucMod(lat + 1, 180), eucMod(lon + 1, 360))
  ].flat();
}
function getRecord(uuid: UUID | Record): Record | undefined {
  if ((uuid as Record).uuid !== undefined) return uuid as Record;
  return data.records[uuid as UUID];
}
function getRoute(uuid: UUID | Route): Route | undefined {
  if ((uuid as Route).uuid !== undefined) return uuid as Route;
  return data.routes[uuid as UUID];
}
function getComment(uuid: UUID | Comment): Comment | undefined {
  if ((uuid as Comment).uuid !== undefined) return uuid as Comment;
  return data.comments[uuid as UUID];
}
function getImage(uuid: UUID | Image): Image | undefined {
  if ((uuid as Image).uuid !== undefined) return uuid as Image;
  return data.images[uuid as UUID];
}
function getUUID(uuid: UUID | Record | Route | Comment | Image): UUID {
  if ((uuid as Record).uuid !== undefined) return (uuid as Record).uuid;
  if ((uuid as Route).uuid !== undefined) return (uuid as Route).uuid;
  if ((uuid as Comment).uuid !== undefined) return (uuid as Comment).uuid;
  if ((uuid as Image).uuid !== undefined) return (uuid as Image).uuid;
  return uuid as UUID;
}
function delArr<T>(arr: T[], item: T | ((v: T) => boolean)): boolean {
  const i = item instanceof Function ? arr.findIndex(item) : arr.indexOf(item);
  if (i >= 0) {
    arr.splice(i, 1);
    return true;
  }
  return false;
}
async function validateImage(img: Buffer): Promise<boolean> {
  try {
    return analyzeImage(img) < THRESHOLD;
  } catch {
    return false;
  }
}
async function validateText(txt: string): Promise<boolean> {
  try {
    const res = await analyzeComment(txt, { attributes: ['TOXICITY', 'IDENTITY_ATTACK'] });
    return (
      res.attributeScores.TOXICITY.summaryScore.value < THRESHOLD &&
      res.attributeScores.IDENTITY_ATTACK.summaryScore.value < THRESHOLD
    );
  } catch {
    return false;
  }
}
export class DataBase {
  static getNearest(lat: number, lon: number): PublicRecord | undefined {
    lat = eucMod(lat, 180);
    lon = eucMod(lon, 360);
    return DataBase.getNearby(lat, lon)[0];
  }
  static getNearby(lat: number, lon: number, filter?: (record: PublicRecord) => boolean): PublicRecord[] {
    lat = eucMod(lat, 180);
    lon = eucMod(lon, 360);
    let arr = getNearbyRecords(lat, lon).map((v) => getRecord(v) as Record);
    if (filter !== undefined) arr = arr.filter((v) => filter(v));
    return arr.sort((a, b) => dist(lat, lon, a.lat, a.lon) - dist(lat, lon, b.lat, b.lon));
  }

  static getRecord(uuid: UUID | PublicRecord): PublicRecord | undefined {
    return getRecord(uuid);
  }
  static async addRecord(lat: number, lon: number, name: string, desc: string): Promise<PublicRecord | undefined> {
    if (!await validateText(name)) return;
    if (!await validateText(desc)) return;
    lat = eucMod(lat, 180);
    lon = eucMod(lon, 360);
    const uuid = randomUUID();
    const record: Record = {
      uuid,
      lat,
      lon,
      name,
      desc,
      images: [],
      comments: [],
      routes: []
    };
    data.records[uuid] = record;
    getRecords(lat, lon).push(uuid);
    trySave();
    return record;
  }
  static deleteRecord(uuid: UUID | PublicRecord): PublicRecord | undefined {
    if (getRecord(uuid) === undefined) return;
    const u = getUUID(uuid);
    const rec = data.records[u];
    delete data.records[u];
    rec.routes.forEach((v) => {
      const r = getRoute(v);
      if (r === undefined) return;
      delArr(r.nodes, u);
      if (r.nodes.length === 0) DataBase.deleteRoute(r);
    });
    rec.comments.forEach((v) => DataBase.deleteComment(v));
    rec.images.forEach((v) => DataBase.deleteImage(v));
    delArr(getRecords(rec.lat, rec.lon), u);
    trySave();
    return rec;
  }
  static async updateRecordName(uuid: UUID | PublicRecord, name: string): Promise<PublicRecord | undefined> {
    const r = getRecord(uuid);
    if (r === undefined) return;
    if (!await validateText(name)) return;
    r.name = name;
    trySave();
    return r;
  }
  static async updateRecordDesc(uuid: UUID | PublicRecord, desc: string): Promise<PublicRecord | undefined> {
    const r = getRecord(uuid);
    if (r === undefined) return;
    if (!await validateText(desc)) return;
    r.desc = desc;
    trySave();
    return r;
  }

  static getComment(uuid: UUID | PublicComment): PublicComment | undefined {
    return getComment(uuid);
  }
  static async addComment(record: PublicRecord, comment: string): Promise<PublicComment | undefined> {
    if (!await validateText(comment)) return;
    const c: Comment = { uuid: randomUUID(), text: comment, ruuid: record.uuid };
    record.comments.push(c.uuid);
    data.comments[c.uuid] = c;
    trySave();
    return c;
  }
  static deleteComment(uuid: UUID | PublicComment): PublicComment | undefined {
    if (getComment(uuid) === undefined) return;
    const u = getUUID(uuid);
    const com = data.comments[u];
    delete data.comments[u];
    if (com.ruuid !== undefined && getRecord(com.ruuid)) delArr(getRecord(com.ruuid)!.comments, u);
    trySave();
    return com;
  }

  static getImage(uuid: UUID | PublicImage): PublicImage | undefined {
    return getImage(uuid);
  }
  static async uploadImage(img: Buffer, ext: string): Promise<PublicImage | undefined> {
    if (!/^\.\S{3,4}$/.test(ext)) return;
    if (!await validateImage(img)) return;
    const uuid = randomUUID();
    await writeFileP(IMAGE_PATH + uuid + ext, img);
    const i = {
      uuid,
      ext,
      path: IMAGE_PATH + uuid + ext
    };
    data.images[uuid] = i;
    trySave();
    return i;
  }
  static addImage(record: PublicRecord, img: PublicImage): PublicImage | undefined {
    if (img.ruuid !== undefined) return;
    record.images.push(img.uuid);
    (img as Image).ruuid = record.uuid;
    trySave();
    return img;
  }
  static async addImageBuffer(record: PublicRecord, img: Buffer, ext: string): Promise<PublicImage | undefined> {
    const image = await DataBase.uploadImage(img, ext);
    if (image === undefined) return;
    return DataBase.addImage(record, image);
  }
  static deleteImage(uuid: UUID | PublicImage): PublicImage | undefined {
    if (getImage(uuid) === undefined) return;
    const u = getUUID(uuid);
    const img = data.images[u];
    delete data.images[u];
    if (img.ruuid !== undefined && getRecord(img.ruuid)) delArr(getRecord(img.ruuid)!.images, u);
    trySave();
    return img;
  }

  static getRoute(uuid: UUID | PublicRoute): PublicRoute | undefined {
    return getRoute(uuid);
  }
  static async addRoute(name: string, desc: string, ...records: PublicRecord[]): Promise<PublicRoute | undefined> {
    if (!await validateText(name)) return;
    if (!await validateText(desc)) return;
    const uuid = randomUUID();
    const r: Route = {
      uuid,
      name,
      desc,
      nodes: records.map((v) => v.uuid)
    };
    data.routes[r.uuid] = r;
    records.forEach((v) => v.routes.push(r.uuid));
    trySave();
    return r;
  }
  static deleteRoute(uuid: UUID | PublicRoute): PublicRoute | undefined {
    if (getRoute(uuid) === undefined) return;
    const u = getUUID(uuid);
    const rou = data.routes[u];
    delete data.routes[u];
    rou.nodes.forEach((v) => {
      const r = getRecord(v);
      if (r === undefined) return;
      delArr(r.routes, u);
    });
    trySave();
    return rou;
  }
  static addToRoute(route: UUID | PublicRoute, record: UUID | PublicRecord, index?: number): boolean {
    const rou = getRoute(route);
    const rec = getRecord(record);
    if (rou === undefined || rec === undefined) return false;
    rec.routes.push(rou.uuid);
    if (index === undefined) index = rou.nodes.length;
    rou.nodes.splice(index, 0, rec.uuid);
    trySave();
    return true;
  }
  static deleteFromRoute(route: UUID | PublicRoute, record: UUID | PublicRecord): boolean {
    const rou = getRoute(route);
    const rec = getRecord(record);
    if (rou === undefined || rec === undefined) return false;
    const a = delArr(rec.routes, rou.uuid);
    const b = delArr(rou.nodes, rec.uuid);
    trySave();
    return a || b;
  }
  static async updateRouteName(uuid: UUID | PublicRoute, name: string): Promise<PublicRoute | undefined> {
    const r = getRoute(uuid);
    if (r === undefined) return;
    if (!await validateText(name)) return;
    r.name = name;
    trySave();
    return r;
  }
  static async updateRouteDesc(uuid: UUID | PublicRoute, desc: string): Promise<PublicRoute | undefined> {
    const r = getRoute(uuid);
    if (r === undefined) return;
    if (!await validateText(desc)) return;
    r.desc = desc;
    trySave();
    return r;
  }
}
