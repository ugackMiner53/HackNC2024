const EARTH_RADIUS = 6371_000;
export function dist(lat1: number, lon1: number, lat2: number, lon2: number, radius: number = EARTH_RADIUS): number {
  const x1 = radius * Math.cos(lat1) * Math.cos(lon1);
  const y1 = radius * Math.cos(lat1) * Math.sin(lon1);
  const z1 = radius * Math.sin(lat1);
  const x2 = radius * Math.cos(lat2) * Math.cos(lon2);
  const y2 = radius * Math.cos(lat2) * Math.sin(lon2);
  const z2 = radius * Math.sin(lat2);
  const eucDis = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
  const centralAngle = Math.asin(eucDis / 2 / radius) * 2;
  const dis = ~~(2 * radius * Math.sin(Math.sqrt(centralAngle)));
  return dis;
}
