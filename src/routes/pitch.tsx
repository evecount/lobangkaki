import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, HeartHandshake, Mic, Camera, MapPin, BadgeCheck, Clock3, MessageCircle, Users, Heart, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionSticker } from "@/components/ActionSticker";
import hawkerImage from "@/assets/hawker-chicken-rice.jpg";

const slides = [
  { kicker: "SAIA AI FESTIVAL 2026 · HACK FOR HUMANITY", title: "LobangKaki (甘榜通)", section: "Title" },
  { kicker: "THE PROBLEM", title: "The Digital Exclusion Barrier", section: "The Problem" },
  { kicker: "GUIDING PRINCIPLE", title: "Dignity by Design", section: "Dignity by Design" },
  { kicker: "THE SOLUTION", title: "Headless Audio Gateway", section: "The Solution" },
  { kicker: "SYSTEM ARCHITECTURE", title: "The Zero–Dollar Engine", section: "System Architecture" },
  { kicker: "TRUST & SAFETY", title: "Anti-Prank Guardrails", section: "Trust & Safety" },
  { kicker: "JUDGING ALIGNMENT", title: "Five Pillar Rubric Match", section: "Judging Alignment" },
  { kicker: "VALIDATION & SCENARIOS", title: "Instant Demo Pathways", section: "Validation Scenarios" },
  { kicker: "SCALABILITY & IMPACT", title: "Zero Marginal Cost", section: "Scalability & Impact" },
  { kicker: "HACK FOR HUMANITY 2026", title: "Restoring the Kampung Spirit", section: "Hack for Humanity 2026" },
  { kicker: "CREDITS", title: "Sources & acknowledgements", section: "Sources" },
  { kicker: "LIVE TECH · ZERO SIGN-IN", title: "A Real-Time App Nobody Logs Into", section: "Live Tech" },
  { kicker: "SINGAPORE WALKABILITY", title: "Deals Within a 5–10 Minute Walk", section: "Walkable Towns" },
];
const order = [0, 1, 2, 3, 4, 11, 5, 12, 6, 7, 8, 9, 10];
const slideStickers = ["food", "walk", "cc"] as const;

export const Route = createFileRoute("/pitch")({
  validateSearch: (search: Record<string, unknown>) => ({ slide: Math.min(slides.length, Math.max(1, Number.isFinite(Number(search["slide"])) ? Math.floor(Number(search["slide"])) : 1)) }),
  head: () => ({ meta: [
    { title: "11-Slide Pitch Deck — LobangKaki (甘榜通)" },
    { name: "description", content: "The complete LobangKaki Hack for Humanity 2026 pitch, presented as accessible interactive HTML slides." },
    { property: "og:title", content: "LobangKaki — Hack for Humanity Pitch" },
    { property: "og:description", content: "Eleven slides on dignity-first community care, trust, and zero-friction access." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PitchPage,
});

function Tile({ icon: Icon, title, detail }: { icon: typeof Heart; title: string; detail: string }) {
  return <div className="pitch-tile"><Icon className="pitch-tile-icon" aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></div>;
}

function SlideContent({ index }: { index: number }) {
  switch (index) {
    case 0: return <div className="pitch-opening"><div><p className="pitch-lead">Headless social infrastructure for the next billion users of artificial intelligence.</p><div className="pitch-accent-line" /></div><div className="pitch-three"><span><small>DESIGN PHILOSOPHY</small><strong>Dignity by Design</strong></span><span><small>INTERFACE PARADIGM</small><strong>Zero-Text Dialect Audio</strong></span><span><small>ECOSYSTEM TARGET</small><strong>Hyperlocal Mutual Aid</strong></span></div></div>;
    case 1: return <><div className="pitch-grid pitch-grid--three"><Tile icon={MessageCircle} title="App Fatigue" detail="Complex portals are too hard to use." /><Tile icon={BookOpen} title="Confusing Letters" detail="Official notices are hard to understand." /><Tile icon={Heart} title="Disconnected Aid" detail="Daily surplus goes unclaimed." /></div><p className="pitch-bottom-note">The next billion will not type prompts into standard chatbot textboxes.</p></>;
    case 2: return <><div className="pitch-grid pitch-grid--two"><div className="pitch-tile"><small>TRADITIONAL CIVIC TECH</small><h3>Forms before help.</h3><p>Login required · Text-heavy forms · Impersonal queues</p></div><div className="pitch-tile pitch-tile--accent"><small>THE LOBANGKAKI MODEL</small><h3>People before paperwork.</h3><p>Zero senior login · Familiar voice · A reassuring community bridge</p></div></div><p className="pitch-bottom-note">Preserving elder independence while powering neighbourhood support.</p></>;
    case 3: return <><div className="pitch-solution"><ActionSticker kind="food" /><div><p className="pitch-quote">“Chicken rice stall closing, 6 packs left — 2-for-1, or free for seniors.”</p><p>Voice in. A calm reply out. A community request ready for local volunteers.</p></div></div><div className="pitch-three pitch-three--border"><span>No new app</span><span>Familiar speech</span><span>Accessible readout</span></div><p className="pitch-caveat">The current festival demo runs in the browser; it is not connected to WhatsApp or a live volunteer network. Dialect coverage requires validation.</p></>;
    case 4: return <><div className="pitch-steps"><div><Mic /><small>STEP 01</small><strong>Voice ingress</strong><span>Browser speech capture</span></div><div><Zap /><small>STEP 02</small><strong>Intent extraction</strong><span>Postal code → OneMap → 4 nearest NEA centres</span></div><div><MessageCircle /><small>STEP 03</small><strong>Audio receipt</strong><span>Calm spoken response</span></div><div><Users /><small>STEP 04</small><strong>Task router</strong><span>Live cloud database + realtime volunteer board</span></div></div><p className="pitch-bottom-note">Browser speech in and out, a shared realtime database for deals, private photo storage, and server-side geofence checks. All on a $0 stack.</p></>;
    case 5: return <><div className="pitch-grid pitch-grid--three"><Tile icon={Camera} title="Physical Grounding" detail="Live stall snapshot and nearby location check." /><Tile icon={BadgeCheck} title="Community Chop" detail="A second volunteer demo check before audio." /><Tile icon={Clock3} title="Anomaly & Expiry" detail="Rapid posting is held; stale offers expire." /></div><p className="pitch-bottom-note">Only checked, unexpired deals enter the senior audio in this demo. Browser location and anonymous volunteer taps are not real-world proof.</p></>;
    case 6: return <><div className="pitch-grid pitch-grid--five"><Tile icon={Mic} title="Silver Ties" detail="Voice-first access" /><Tile icon={Users} title="Care Mesh" detail="Neighbour help" /><Tile icon={HeartHandshake} title="Kinder Web" detail="Calm, plain words" /><Tile icon={Heart} title="Dignity UX" detail="No senior login" /><Tile icon={MessageCircle} title="No Exclusions" detail="Language ambition" /></div><p className="pitch-bottom-note">An approach to the SAIA Festival challenge priorities; multilingual synthesis is a future goal, not a tested capability here.</p></>;
    case 7: return <><div className="pitch-demo"><img src={hawkerImage} alt="Chicken rice meal at a hawker centre" width={1200} height={800} /><div><div><ActionSticker kind="food" compact /><span><strong>1. Hawker Surplus</strong><small>Reduce waste, check before sharing.</small></span></div><div><ActionSticker kind="cc" compact /><span><strong>2. Kampung Events</strong><small>Share what's on at the community club.</small></span></div><div><ActionSticker kind="walk" compact /><span><strong>3. Silver Companion</strong><small>Point neighbours toward local groups.</small></span></div></div></div><p className="pitch-caveat">Preset examples keep the festival demo usable without a network. They are not live deals or event confirmations.</p></>;
    case 8: return <><div className="pitch-stats"><div><strong>$0</strong><span>API spend in this simulator</span></div><div><strong>0</strong><span>Senior sign-ins</span></div><div><strong>MIT</strong><span>Open-source license</span></div></div><p className="pitch-bottom-note">A foundation for community deployment—not a live service yet. Real rollout needs trusted local partners, sustained operations, and safety validation.</p></>;
    case 9: return <><div className="pitch-finale"><div className="pitch-finale-stickers"><ActionSticker kind="food" compact /><ActionSticker kind="cc" compact /><ActionSticker kind="walk" compact /></div><p className="pitch-lead">Dignity by Design. Zero senior logins. No one left behind.</p><p>Made with <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer">Lovable</a> for <a href="https://www.aicollective.com/h4h" target="_blank" rel="noopener noreferrer">Hack for Humanity</a> · MIT License</p></div><p className="pitch-caveat">The source deck contains a placeholder repository URL. Find the project details in the README instead.</p></>;
    case 11: return <><div className="pitch-grid pitch-grid--three"><Tile icon={Camera} title="Photo is the password" detail="Posters snap a live in-browser photo; stored privately, shown via short-lived signed links." /><Tile icon={MapPin} title="Server-side 100 m check" detail="The server recomputes distance to the official NEA centre and rejects anything farther or too inaccurate." /><Tile icon={Zap} title="Realtime for everyone" detail="Posts, chops and reports sync instantly to every open screen through a shared cloud database." /></div><div className="pitch-three pitch-three--border"><span>No accounts, phone numbers or NRIC</span><span>Anonymous device ID for rate limits</span><span>Poster can't chop own deal</span></div><p className="pitch-bottom-note">Honest limits: browser location can be spoofed and device IDs reset, so these rails deter pranks rather than prove identity.</p></>;
    case 12: return <><div className="pitch-grid pitch-grid--four">{[["123", "official NEA hawker centres from Data.gov.sg"], ["~690 m", "median gap to the nearest other centre (≈ 9 min walk)*"], ["67%", "of centres have another within 800 m*"], ["~78%", "of resident households live in HDB flats (SingStat 2023)"]].map(([n, l]) => <div key={n} className="pitch-tile"><h3>{n}</h3><p>{l}</p></div>)}</div><div className="pitch-solution"><ActionSticker kind="walk" callout="Only 10 min away!" /><p>HDB towns are planned around neighbourhood centres, so LobangKaki matches a senior's postal code to the 4 closest centres and only speaks deals within a short walk. No dead runs across the island.</p></div><p className="pitch-bottom-note">*Computed from the bundled Data.gov.sg dataset at ~80 m per minute walking pace.</p></>;
    default: return <><div className="pitch-sources"><div><BookOpen /><strong>Original presentation</strong><span>Supplied LobangKaki 11-slide PDF</span></div><div><HeartHandshake /><strong>Project source</strong><span>Full supplied README, MIT license and live browser demo</span></div><div><ArrowUpRight /><strong>Image credits in source deck</strong><span>Reddit · xiohoo.com · asset.imagevideoai.com (as credited in the supplied presentation)</span></div></div><p className="pitch-caveat">The illustrated food, community and walking stickers were created for this HTML presentation.</p></>;
  }
}

function PitchPage() {
  const { slide } = Route.useSearch();
  const navigate = useNavigate({ from: "/pitch" });
  const index = order[slide - 1] ?? 0;
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [transitioning, setTransitioning] = useState(false);
  const previousIndex = useRef(index);
  useEffect(() => {
    if (previousIndex.current === index) return;
    setDirection(index > previousIndex.current ? "forward" : "back");
    previousIndex.current = index;
    setTransitioning(true);
    const timeout = window.setTimeout(() => setTransitioning(false), 350);
    return () => window.clearTimeout(timeout);
  }, [index]);
  useEffect(() => { document.title = `${slide}/${slides.length} — ${slides[index]?.title ?? "LobangKaki"}`; }, [slide, index]);
  function go(next: number) { if (next < 1 || next > slides.length || next === slide) return; void navigate({ search: { slide: next }, replace: true }); }
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); go(slide + 1); }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); go(slide - 1); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [slide]);
  const current = slides[index];
  if (!current) return null;
  return <main className="pitch-page bg-background text-foreground">
    <header className="pitch-toolbar"><Link to="/" className="pitch-brand"><HeartHandshake className="size-5 shrink-0" /> <span>LobangKaki 甘榜通</span></Link><div className="flex items-center gap-2"><Button asChild variant="outline" size="sm"><Link to="/readme">README</Link></Button><Button asChild size="sm"><Link to="/">Try chat <ArrowUpRight /></Link></Button></div></header>
    <div className="pitch-stage" aria-label={`Slide ${slide} of ${slides.length}: ${current.section}`} aria-live="polite">
      <article key={slide} className={`pitch-slide pitch-slide--${index === 0 || index === 9 ? "dark" : "light"} ${transitioning ? direction === "forward" ? "pitch-enter-forward" : "pitch-enter-back" : ""}`}>
        <div className="pitch-slide-top"><span>{current.kicker}</span><span className="pitch-page-number">{String(slide).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span></div>
        <h1 className="pitch-heading">{current.title}</h1>
        <div className="pitch-slide-content"><SlideContent index={index} /></div>
        <div className="pitch-corner-sticker" aria-hidden="true"><ActionSticker kind={slideStickers[slide % slideStickers.length] ?? "food"} compact /></div>
      </article>
    </div>
    <nav className="pitch-nav" aria-label="Presentation navigation"><Button variant="outline" size="icon" onClick={() => go(slide - 1)} disabled={slide === 1} aria-label="Previous slide" title="Previous slide" className="size-11 shrink-0"><ChevronLeft /></Button><div className="pitch-progress" role="progressbar" aria-valuenow={slide} aria-valuemin={1} aria-valuemax={slides.length} aria-label="Slide progress"><div style={{ width: `${slide / slides.length * 100}%` }} /></div><span className="pitch-progress-label">{current.section}</span><Button variant="outline" size="icon" onClick={() => go(slide + 1)} disabled={slide === slides.length} aria-label="Next slide" title="Next slide" className="size-11 shrink-0"><ChevronRight /></Button></nav>
  </main>;
}
