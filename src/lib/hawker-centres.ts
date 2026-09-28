import raw from "./hawker-centres.json";

export type HawkerCentre = { id: string; name: string; address: string; postal: string; lat: number; lon: number };
export const hawkerCentres = raw as HawkerCentre[];

export function metersBetween(lat1: number, lon1: number, lat2: number, lon2: number) {
  const r = 6371000, rad = Math.PI / 180;
  const a = Math.sin((lat2 - lat1) * rad / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin((lon2 - lon1) * rad / 2) ** 2;
  return 2 * r * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestCentres(lat: number, lon: number, count = 4) {
  return hawkerCentres.map(c => ({ ...c, distance: Math.round(metersBetween(lat, lon, c.lat, c.lon)) })).sort((a, b) => a.distance - b.distance).slice(0, count);
}

/** Free OneMap postal lookup (no key); falls back to the nearest bundled centre in the same postal sector. */
export async function locatePostal(postal: string): Promise<{ lat: number; lon: number; label: string } | null> {
  try {
    const res = await fetch(`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(postal)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`);
    if (res.ok) {
      const json = await res.json() as { results?: { LATITUDE: string; LONGITUDE: string; ADDRESS?: string }[] };
      const hit = json.results?.[0];
      if (hit) return { lat: Number(hit.LATITUDE), lon: Number(hit.LONGITUDE), label: hit.ADDRESS ?? postal };
    }
  } catch { /* fall through */ }
  const sector = postal.slice(0, 2);
  const match = hawkerCentres.find(c => c.postal.startsWith(sector));
  return match ? { lat: match.lat, lon: match.lon, label: `postal sector ${sector}` } : null;
}
