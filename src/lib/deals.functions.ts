import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { hawkerCentres, metersBetween } from "./hawker-centres";

export type LiveDeal = { id: string; centre_id: string; centre_name: string; centre_postal: string; stall: string; description: string; diet: string; status: string; is_sample: boolean; proof_distance_m: number | null; chops: number; reports: number; verified_at: string | null; expires_at: string | null; created_at: string; photo: string | null };

const LIFETIME_MS = 2 * 60 * 60 * 1000;
const GEOFENCE_M = 100;

async function admin() { return (await import("@/integrations/supabase/client.server")).supabaseAdmin; }

export const listDeals = createServerFn({ method: "GET" }).handler(async (): Promise<LiveDeal[]> => {
  const db = await admin();
  const nowIso = new Date().toISOString();
  const { data, error } = await db.from("deals").select("*").in("status", ["pending", "verified", "sample"]).order("created_at", { ascending: false }).limit(60);
  if (error) { console.error(error); return []; }
  const rows = (data ?? []).filter(d => d.is_sample || !d.expires_at || d.expires_at > nowIso);
  return Promise.all(rows.map(async d => {
    let photo: string | null = null;
    if (d.photo_url) { const s = await db.storage.from("deal-photos").createSignedUrl(d.photo_url, 3600); photo = s.data?.signedUrl ?? null; }
    return { id: d.id, centre_id: d.centre_id, centre_name: d.centre_name, centre_postal: d.centre_postal, stall: d.stall, description: d.description, diet: d.diet, status: d.status, is_sample: d.is_sample, proof_distance_m: d.proof_distance_m, chops: d.chops, reports: d.reports, verified_at: d.verified_at, expires_at: d.expires_at, created_at: d.created_at, photo };
  }));
});

const geo = { lat: z.number().min(1.1).max(1.5), lon: z.number().min(103.5).max(104.2), accuracy: z.number().min(0).max(5000) };
const device = z.string().uuid();

function checkFence(centreId: string, lat: number, lon: number, accuracy: number) {
  const centre = hawkerCentres.find(c => c.id === centreId);
  if (!centre) return { error: "Unknown hawker centre." } as const;
  const distance = Math.round(metersBetween(lat, lon, centre.lat, centre.lon));
  if (accuracy > GEOFENCE_M || distance > GEOFENCE_M) return { error: `Location is ${distance} m away (±${Math.round(accuracy)} m). You must be within ${GEOFENCE_M} m of the centre.` } as const;
  return { centre, distance } as const;
}

export const postDeal = createServerFn({ method: "POST" })
  .inputValidator(d => z.object({ ...geo, device, centreId: z.string().max(20), stall: z.string().trim().min(2).max(80), description: z.string().trim().min(8).max(240), diet: z.enum(["unknown", "halal", "vegetarian"]), photo: z.string().startsWith("data:image/jpeg;base64,").max(600_000) }).parse(d))
  .handler(async ({ data }) => {
    const fence = checkFence(data.centreId, data.lat, data.lon, data.accuracy);
    if ("error" in fence) return { ok: false as const, message: fence.error };
    const db = await admin();
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await db.from("deal_actions").select("id", { count: "exact", head: true }).eq("device_hash", data.device).eq("kind", "post").gte("created_at", since);
    const bytes = Uint8Array.from(atob(data.photo.split(",")[1] ?? ""), c => c.charCodeAt(0));
    const path = `${crypto.randomUUID()}.jpg`;
    const up = await db.storage.from("deal-photos").upload(path, bytes, { contentType: "image/jpeg" });
    if (up.error) { console.error(up.error); return { ok: false as const, message: "Photo upload failed. Please retry." }; }
    const held = (count ?? 0) >= 3;
    const { data: row, error } = await db.from("deals").insert({ centre_id: fence.centre.id, centre_name: fence.centre.name, centre_postal: fence.centre.postal, stall: data.stall, description: data.description, diet: data.diet, photo_url: path, status: held ? "held" : "pending", proof_distance_m: fence.distance, expires_at: new Date(Date.now() + LIFETIME_MS).toISOString() }).select("id").single();
    if (error) { console.error(error); return { ok: false as const, message: "Could not save the deal." }; }
    await db.from("deal_actions").insert({ deal_id: row.id, device_hash: data.device, kind: "post", distance_m: fence.distance });
    return { ok: true as const, message: held ? "Frequent posting detected: held for review, not broadcast." : `Posted (${fence.distance} m from centre). Needs one volunteer chop before seniors hear it.` };
  });

export const chopDeal = createServerFn({ method: "POST" })
  .inputValidator(d => z.object({ ...geo, device, dealId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: deal } = await db.from("deals").select("*").eq("id", data.dealId).maybeSingle();
    if (!deal || deal.status !== "pending") return { ok: false as const, message: "This deal can no longer be chopped." };
    if (deal.expires_at && deal.expires_at < new Date().toISOString()) return { ok: false as const, message: "This deal has expired." };
    const fence = checkFence(deal.centre_id, data.lat, data.lon, data.accuracy);
    if ("error" in fence) return { ok: false as const, message: fence.error };
    const { data: prior } = await db.from("deal_actions").select("kind").eq("deal_id", deal.id).eq("device_hash", data.device);
    if (prior?.length) return { ok: false as const, message: "The poster or an earlier voter cannot chop this deal." };
    await db.from("deal_actions").insert({ deal_id: deal.id, device_hash: data.device, kind: "chop", distance_m: fence.distance });
    await db.from("deals").update({ status: "verified", chops: deal.chops + 1, verified_at: new Date().toISOString() }).eq("id", deal.id);
    return { ok: true as const, message: `Chopped at ${fence.distance} m. Seniors nearby can now hear this deal.` };
  });

export const reportDeal = createServerFn({ method: "POST" })
  .inputValidator(d => z.object({ device, dealId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: deal } = await db.from("deals").select("id,reports,status,is_sample").eq("id", data.dealId).maybeSingle();
    if (!deal || deal.is_sample) return { ok: false as const, message: "Sample deals can't be reported." };
    const { data: prior } = await db.from("deal_actions").select("id").eq("deal_id", deal.id).eq("device_hash", data.device).eq("kind", "report");
    if (prior?.length) return { ok: false as const, message: "You've already reported this deal." };
    await db.from("deal_actions").insert({ deal_id: deal.id, device_hash: data.device, kind: "report" });
    const reports = deal.reports + 1;
    await db.from("deals").update({ reports, status: reports >= 2 ? "removed" : deal.status }).eq("id", deal.id);
    return { ok: true as const, message: reports >= 2 ? "Two reports: deal withdrawn from senior audio." : "Report recorded. One more removes it." };
  });
