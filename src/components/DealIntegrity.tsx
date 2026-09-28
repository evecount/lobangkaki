import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Clock3, Flag, MapPin, ShieldCheck, X } from "lucide-react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { hawkerCentres } from "@/lib/hawker-centres";
import { chopDeal, postDeal, reportDeal } from "@/lib/deals.functions";
import { deviceId, useLiveDeals } from "@/lib/use-live-deals";
import birdie from "@/assets/sticker-birdie.png";

const dealSchema = z.object({ stall: z.string().trim().min(2, "Enter the stall name.").max(80), description: z.string().trim().min(8, "Describe the meal and price.").max(240) });
const sortedCentres = [...hawkerCentres].sort((a, b) => a.name.localeCompare(b.name));
type Fix = { lat: number; lon: number; accuracy: number };

function getFix(): Promise<Fix> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("no-geo")); return; }
    navigator.geolocation.getCurrentPosition(p => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, accuracy: p.coords.accuracy }), reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  });
}
function left(iso: string | null, now: number) {
  if (!iso) return "—";
  const s = Math.max(0, Math.round((Date.parse(iso) - now) / 1000));
  return `${Math.floor(s / 3600)}h ${String(Math.floor(s / 60) % 60).padStart(2, "0")}m`;
}

import { dealCategories, dealSticker, type DealCategoryId } from "@/lib/deal-categories";

export function DealIntegrity({ cat = "all" }: { cat?: DealCategoryId }) {
  const { data: deals = [], isLoading } = useLiveDeals();
  const activeCat = dealCategories.find(c => c.id === cat) ?? dealCategories[0];
  const visibleDeals = deals.filter(d => activeCat.match(d));
  const queryClient = useQueryClient();
  const post = useServerFn(postDeal), chop = useServerFn(chopDeal), report = useServerFn(reportDeal);
  const [centreId, setCentreId] = useState(sortedCentres[0]?.id ?? "");
  const [stall, setStall] = useState(""); const [description, setDescription] = useState("");
  const [diet, setDiet] = useState<"unknown" | "halal" | "vegetarian">("unknown");
  const [photo, setPhoto] = useState(""); const [cameraOpen, setCameraOpen] = useState(false);
  const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [now, setNow] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null); const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => { setNow(Date.now()); const t = window.setInterval(() => setNow(Date.now()), 30000); return () => { window.clearInterval(t); streamRef.current?.getTracks().forEach(track => track.stop()); }; }, []);
  useEffect(() => { if (cameraOpen && videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current; }, [cameraOpen]);
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["live-deals"] });
  function closeCamera() { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null; setCameraOpen(false); }

  async function startCamera() {
    setNotice(""); setPhoto("");
    if (!navigator.mediaDevices?.getUserMedia) { setNotice("This browser can't open the camera."); return; }
    try { streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }); setCameraOpen(true); }
    catch { setNotice("Camera access was not allowed. Nothing was posted."); }
  }
  function capture() {
    const video = videoRef.current;
    if (!video?.videoWidth) { setNotice("Waiting for camera…"); return; }
    const canvas = document.createElement("canvas");
    canvas.width = 480; canvas.height = Math.round(video.videoHeight * 480 / video.videoWidth);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.7)); closeCamera();
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = dealSchema.safeParse({ stall, description });
    if (!parsed.success) { setNotice(parsed.error.issues[0]?.message ?? "Check your listing."); return; }
    if (!photo) { setNotice("Take a live photo of the stall first."); return; }
    setBusy(true); setNotice("Checking you're within 100 m…");
    try {
      const fix = await getFix();
      const res = await post({ data: { ...fix, device: deviceId(), centreId, stall: parsed.data.stall, description: parsed.data.description, diet, photo } });
      setNotice(res.message);
      if (res.ok) { setStall(""); setDescription(""); setDiet("unknown"); setPhoto(""); void refresh(); }
    } catch { setNotice("Location access was blocked or the post failed. Nothing was posted."); }
    setBusy(false);
  }
  async function doChop(dealId: string) {
    setBusy(true); setNotice("Checking you're at the stall…");
    try { const fix = await getFix(); const r = await chop({ data: { ...fix, device: deviceId(), dealId } }); setNotice(r.message); void refresh(); }
    catch { setNotice("Location access is needed to chop a deal."); }
    setBusy(false);
  }
  async function doReport(dealId: string) {
    try { const r = await report({ data: { device: deviceId(), dealId } }); setNotice(r.message); void refresh(); } catch { setNotice("Could not send the report."); }
  }

  return <div className="mt-7 border-t border-border pt-6">
    <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-3"><img src={birdie} alt="Cheerful little sparrow carrying a food tip" width={1024} height={1024} loading="lazy" className="h-14 w-14 shrink-0 object-contain" /><div><p className="text-xs font-extrabold uppercase text-primary">LIVE · PHOTO PROOF · 100 M GEOFENCE</p><h3 className="mt-1 font-display text-xl font-bold">A Little Birdie Told Me 🐦</h3><p className="mt-0.5 text-sm text-muted-foreground">Spotted a surplus meal or closing discount? Share the tip so neighbours eat well.</p></div></div><span className="rounded-sm bg-secondary px-2.5 py-1.5 text-xs font-bold text-primary">No sign-in</span></div>
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-md border border-border bg-card p-4">
      <h4 className="font-bold">Spot a surplus meal? Tweet it out, birdie!</h4>
      <p className="text-sm text-muted-foreground">Snap a live photo at one of {hawkerCentres.length} official NEA hawker centres. Our server checks you are within 100 m. Deals expire after 2 hours.</p>
      <label className="block text-sm font-bold">Hawker centre (Data.gov.sg)<select value={centreId} onChange={e => setCentreId(e.target.value)} className="mt-1 block h-11 w-full rounded-sm border border-input bg-background px-3 text-base font-normal">{sortedCentres.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label className="block text-sm font-bold">Stall name<input value={stall} onChange={e => setStall(e.target.value)} maxLength={80} placeholder="e.g. Auntie's Chicken Rice" className="mt-1 block h-11 w-full rounded-sm border border-input bg-background px-3 text-base font-normal" /></label>
      <label className="block text-sm font-bold">Meal, price, collection<textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={240} rows={2} placeholder="6 packets, $2 each, before 8pm" className="mt-1 block w-full rounded-sm border border-input bg-background px-3 py-2 text-base font-normal" /></label>
      <label className="block text-sm font-bold">Diet (poster declaration only)<select value={diet} onChange={e => setDiet(e.target.value as typeof diet)} className="mt-1 block h-11 w-full rounded-sm border border-input bg-background px-3 text-base font-normal"><option value="unknown">Not confirmed</option><option value="halal">Halal</option><option value="vegetarian">Vegetarian / Vegan</option></select></label>
      {cameraOpen && <video ref={videoRef} autoPlay muted playsInline className="max-h-64 w-full rounded-sm object-cover" />}
      {photo && <div className="flex items-center gap-3"><img src={photo} alt="Captured stall proof" className="h-16 w-20 rounded-sm object-cover" /><span className="text-sm font-semibold text-primary"><CheckCircle2 className="mr-1 inline size-4" />Live photo ready</span></div>}
      <div className="flex flex-wrap gap-2">{cameraOpen ? <><Button type="button" onClick={capture} className="h-11"><Camera />Capture</Button><Button type="button" variant="outline" onClick={closeCamera} className="h-11"><X />Cancel</Button></> : <Button type="button" variant="outline" onClick={startCamera} className="h-11"><Camera />{photo ? "Retake photo" : "Open live camera"}</Button>}<Button type="submit" className="h-11" disabled={!photo || busy}>{busy ? "Checking…" : "Post for volunteer chop"}</Button></div>
    </form>
    <p className="mt-3 min-h-5 text-sm font-medium text-muted-foreground" role="status">{notice}</p>
    <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs" aria-label="Anti-prank integrity tally">
      <div className="rounded-xl bg-food/40 p-2"><strong className="block text-base">{deals.filter(d => d.status === "verified").length}</strong>🟢 Verified by volunteer</div>
      <div className="rounded-xl bg-warning/30 p-2"><strong className="block text-base">{deals.filter(d => d.status === "pending").length}</strong>🟡 Pending verification</div>
      <div className="rounded-xl bg-destructive/15 p-2"><strong className="block text-base">{deals.reduce((n, d) => n + (d.reports ?? 0), 0)}</strong>🚩 Phantom flags (2 = withdrawn)</div>
    </div>
    <div className="mt-3 space-y-3">
      {isLoading && <p className="text-sm text-muted-foreground">Loading live deals…</p>}
      {!isLoading && !visibleDeals.length && <p className="text-sm text-muted-foreground">No {activeCat.label.toLowerCase()} deals right now — check another category.</p>}
      {visibleDeals.map(d => { const sticker = dealSticker(d); return <article key={d.id} className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3"><img src={sticker.image} alt={sticker.alt} width={1024} height={1024} loading="lazy" className="h-16 w-16 shrink-0 object-contain" />{d.photo ? <img src={d.photo} alt={`Stall photo for ${d.stall}`} className="h-16 w-16 shrink-0 rounded-xl object-cover" /> : null}<div className="min-w-0"><p className="font-bold leading-snug">{d.stall}</p><p className="mt-0.5 text-sm text-muted-foreground">{d.description}</p></div></div>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4 shrink-0" />{d.centre_name}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
          <span className={`rounded-sm px-2 py-1 ${d.is_sample ? "bg-secondary text-primary" : d.status === "verified" ? "bg-food text-food-foreground" : "bg-warning text-warning-foreground"}`}>{d.is_sample ? "EXAMPLE · for testing" : d.status === "verified" ? "🟢 Chopped by volunteer" : "🟡 Needs 1 volunteer chop"}</span>
          <span className="inline-flex items-center gap-1 rounded-sm bg-secondary px-2 py-1 text-primary"><Clock3 className="size-3.5" />{d.is_sample ? "Real deals expire 2 h after posting" : now ? `Expires in ${left(d.expires_at, now)}` : "Expires in …"}</span>
          {d.proof_distance_m !== null && <span className="rounded-sm bg-secondary px-2 py-1 text-primary">Photo {d.proof_distance_m} m from centre</span>}
        </div>
        {!d.is_sample && <div className="mt-3 flex flex-wrap gap-2">{d.status === "pending" && <Button type="button" disabled={busy} onClick={() => doChop(d.id)} className="h-11"><ShieldCheck />Chop / Verified</Button>}<Button type="button" variant="outline" onClick={() => doReport(d.id)} className="h-11"><Flag />Report closed {d.reports ? `(${d.reports}/2)` : ""}</Button></div>}
      </article>; })}
    </div>
    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Limits: browser location can be spoofed and anonymous device IDs can be reset, so these rails deter pranks but don't prove identity. Always confirm with the stall.</p>
  </div>;
}
