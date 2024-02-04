const EARTH_RADIUS = 6371_000;
const DEG2RAD = Math.PI / 180;
export function dist(lat1: number, lon1: number, lat2: number, lon2: number, radius: number = EARTH_RADIUS): number {
  const x1 = radius * Math.cos(lat1 * DEG2RAD) * Math.cos(lon1 * DEG2RAD);
  const y1 = radius * Math.cos(lat1 * DEG2RAD) * Math.sin(lon1 * DEG2RAD);
  const z1 = radius * Math.sin(lat1 * DEG2RAD);
  const x2 = radius * Math.cos(lat2 * DEG2RAD) * Math.cos(lon2 * DEG2RAD);
  const y2 = radius * Math.cos(lat2 * DEG2RAD) * Math.sin(lon2 * DEG2RAD);
  const z2 = radius * Math.sin(lat2 * DEG2RAD);
  const eucDis = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
  const centralAngle = Math.asin(eucDis / 2 / radius) * 2;
  const dis = ~~(2 * radius * Math.sin(Math.sqrt(centralAngle)));
  return dis;
}
