import type { PublicRecord } from "$lib/server/database";

export default function(record: PublicRecord): PublicRecord {
  return Object.assign({}, record, { lat: record.lat - 90, lon: record.lon - 180 });
}