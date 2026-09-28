import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, CheckCheck, ChevronRight, Keyboard, MapPin, Mic, MicOff, Send, ShieldCheck, Soup, Volume2, VolumeX, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DealIntegrity } from "@/components/DealIntegrity";
import { DealStickerGrid } from "@/components/DealStickerGrid";
import type { DealCategoryId } from "@/lib/deal-categories";
import otterLogo from "@/assets/otter-logo.png";
import { ActionSticker, GroupSticker, type StickerKind } from "@/components/ActionSticker";
import { copy, languages, type MealDiet, type ResidentLanguage } from "@/lib/resident-language";
import { findNeighbourhood, type StallDiet } from "@/lib/neighbourhoods";
import { locatePostal, nearestCentres } from "@/lib/hawker-centres";
import { useLiveDeals } from "@/lib/use-live-deals";
import { MessageCircle, Info, Users, Share2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "LobangKaki (甘榜通) — Dignity by Design" },
    { name: "description", content: "A free, no-download community assistant simulator for meal lobang, CC events, and neighbourhood care." },
    { property: "og:title", content: "LobangKaki (甘榜通) — Dignity by Design" },
    { property: "og:description", content: "A free, no-download community assistant simulator for meal lobang, CC events, and neighbourhood care." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LobangKaki,
});

type Category = "Food Rescue" | "Senior Activity" | "Community Request";
type Entry = { id: number; category: Category; location: string; urgency: string; title: string; detail: string; time: string; assisted: boolean; };
type Message = { id: number; from: "resident" | "bot"; text: string; tag?: string; category?: Category; time: string; dealId?: number; diet?: MealDiet | "unknown"; options?: { title: string; sub: string; diet?: StallDiet | undefined }[]; };
type Recognition = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; };
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

const demos = [
  { label: "Hawker food lobang", kind: "food" as StickerKind, text: "Auntie chicken rice stall closing at Bedok, 6 packets unsold — 2-for-1, or free for seniors with blue CHAS card." },
  { label: "CC and kampung events", kind: "cc" as StickerKind, text: "" },
  { label: "Find an activity group", kind: "walk" as StickerKind, text: "Any dancerobics, wushu, karaoke or brisk walking group near Ang Mo Kio CC this Wednesday morning?" },
];

function stickerFor(category: Category): StickerKind | null { return category === "Food Rescue" ? "food" : category === "Senior Activity" ? "walk" : category === "Community Request" ? "cc" : null; }

const initialMessages: Message[] = [
  { id: 1, from: "bot", text: copy.en.greeting, time: "09:41" },
  { id: 900, from: "bot", text: "🍲 Makan time? Hawker centres near you may have meal lobang today. Interested? Just say your postal code or estate, e.g. 460085 or Bedok.", tag: "🍲 MEAL LOBANG", category: "Food Rescue", time: "09:41" },
];

function classify(text: string): { category: Category; location: string; urgency: string; title: string; reply: string; tag: string; detail: string } {
  const lower = text.toLowerCase();
  const location = /bedok/.test(lower) ? "Bedok" : /ang mo kio|amk/.test(lower) ? "Ang Mo Kio" : /tampines/.test(lower) ? "Tampines" : /toa payoh/.test(lower) ? "Toa Payoh" : "Neighbourhood not specified";
  if (/walk|jalan|brisk|dancerobics|dance|wushu|taichi|tai chi|karaoke|sing|kbox|club|gathering|lunch|activity|social|lonely|wednesday/.test(lower)) {
    return { category: "Senior Activity", location, urgency: "Community", title: "Neighbour looking for company", tag: "🤝 FIND A GROUP", detail: "Looking for a walking, dancerobics, wushu, karaoke or lunch group.", reply: `That sounds lovely. I don't have a live events list, so I can't confirm a gathering this Wednesday. Try asking ${location === "Neighbourhood not specified" ? "your nearby" : location} Community Club about their latest walking, dancerobics, wushu, karaoke or lunch groups. A volunteer can help you check.` };
  }
  if (/food|meal|rice|hawker|packet|stall|surplus|hungry|chas|eat/.test(lower)) {
    return { category: "Food Rescue", location, urgency: "Unverified tip", title: "Unverified food tip · needs stall check", tag: "🟡 UNVERIFIED FOOD TIP", detail: text.length > 105 ? `${text.slice(0, 102)}…` : text, reply: "Thanks for sharing. This is only an unverified tip. Please do not travel or share it as an available meal yet. A hawker or neighbour must submit a live stall photo and location check, then a volunteer must check it. Availability, price and eligibility still need direct confirmation." };
  }
  return { category: "Community Request", location, urgency: "Needs review", title: "Neighbour asked for help", tag: "💚 HERE TO HELP", detail: text.length > 105 ? `${text.slice(0, 102)}…` : text, reply: "Thanks for telling me. I’m a demo assistant, so I can’t check live services yet. If you share your neighbourhood and what kind of help you need, a volunteer can follow up in this simulation. For immediate danger, call local emergency services." };
}

const timeNow = () => new Date().toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false });

function LobangKaki() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [feed, setFeed] = useState<Entry[]>([]);
  const [dealCat, setDealCat] = useState<DealCategoryId>("all");
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [notice, setNotice] = useState("");
  const [language, setLanguage] = useState<ResidentLanguage>("en");
  const [mealDiet, setMealDiet] = useState<MealDiet>("all");
  const [showHint, setShowHint] = useState(false);
  const [textOpen, setTextOpen] = useState(false);
  const [headerLanguageIndex, setHeaderLanguageIndex] = useState(0);
  const t = copy[language];
  const suitableMeals = messages.filter(message => message.dealId !== undefined && message.category === "Food Rescue" && (mealDiet === "all" || message.diet === mealDiet));
  const recognitionRef = useRef<Recognition | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);
  const [intent, setIntent] = useState<StickerKind | null>("food");
  const [tab, setTab] = useState<"chat" | "deals" | "about">("chat");
  const { data: liveDeals = [] } = useLiveDeals();

  const askCopy: Partial<Record<StickerKind, Record<ResidentLanguage, string>>> = {
    food: { en: "Meal Lobang it is! What is your 6-digit postal code or estate? (e.g. 460085 or Bedok) I'll show 4 nearby stalls.", zh: "好！请告诉我你的六位邮区编号或住的地区（例如 460085 或 勿洛 Bedok），我列出附近4个摊位。", ms: "Baik! Apakah poskod 6 digit atau kawasan anda? (cth. 460085 atau Bedok) Saya tunjuk 4 gerai berdekatan.", ta: "சரி! உங்கள் 6 இலக்க அஞ்சல் குறியீடு அல்லது பகுதி என்ன? (எ.கா. 460085 அல்லது Bedok) அருகிலுள்ள 4 கடைகளைக் காட்டுவேன்." },
    walk: { en: "Let's find a group! Walking, dancerobics, wushu or karaoke? What is your 6-digit postal code or estate? (e.g. 560123 or Ang Mo Kio)", zh: "一起找小组！散步、健身操、武术还是卡拉OK？请告诉我你的六位邮区编号或地区（例如 560123 或 宏茂桥 Ang Mo Kio）。", ms: "Jom cari kumpulan! Jalan, senamrobik, wushu atau karaoke? Apakah poskod 6 digit atau kawasan anda? (cth. 560123 atau Ang Mo Kio)", ta: "குழுவைத் தேடலாம்! நடை, நடனப் பயிற்சி, வுஷூ அல்லது கராவோக்கே? உங்கள் 6 இலக்க அஞ்சல் குறியீடு அல்லது பகுதி என்ன? (எ.கா. 560123 அல்லது Ang Mo Kio)" },
    cc: { en: "Let's see what's on! What is your 6-digit postal code or estate? (e.g. 310123 or Toa Payoh) I'll show 4 CC & kampung events.", zh: "看看有什么活动！请告诉我你的六位邮区编号或地区（例如 310123 或 大巴窑 Toa Payoh）。", ms: "Mari lihat acara! Apakah poskod 6 digit atau kawasan anda? (cth. 310123 atau Toa Payoh)", ta: "என்ன நிகழ்ச்சிகள் என்று பார்க்கலாம்! உங்கள் 6 இலக்க அஞ்சல் குறியீடு அல்லது பகுதி என்ன? (எ.கா. 310123 அல்லது Toa Payoh)" },
  };

  function pickSticker(kind: StickerKind) {
    setIntent(kind);
    const text = askCopy[kind]?.[language] ?? "";
    setMessages(current => [...current, { id: nextId.current++, from: "bot", text, category: kind === "food" ? "Food Rescue" : "Senior Activity", tag: kind === "food" ? "🍲 MEAL LOBANG" : kind === "cc" ? "🏛️ CC & KAMPUNG EVENTS" : "🤝 FIND A GROUP", time: timeNow() }]);
    setNotice("Say or type your postal code.");
    setTextOpen(true);
    speak(text);
  }

  async function foodLookup(clean: string, postal: string) {
    const time = timeNow();
    setMessages(current => [...current, { id: nextId.current++, from: "resident", text: clean, time }]);
    setDraft(""); setIntent(null); setNotice("Finding the closest official hawker centres…");
    const spot = await locatePostal(postal);
    if (!spot) { const text = "Sorry, I couldn't find that postal code. Please try another 6-digit postal code."; setMessages(c => [...c, { id: nextId.current++, from: "bot", text, time }]); speak(text); return; }
    const near = nearestCentres(spot.lat, spot.lon, 4);
    const verified = liveDeals.filter(d => d.status === "verified" && !d.is_sample && near.some(c => c.id === d.centre_id) && (mealDiet === "all" || d.diet === mealDiet));
    const samples = liveDeals.filter(d => d.is_sample && near.some(c => c.id === d.centre_id));
    const options = near.map(c => {
      const v = verified.filter(d => d.centre_id === c.id);
      const sm = samples.filter(d => d.centre_id === c.id);
      return { title: `${c.name} · ${c.distance < 1000 ? `${c.distance} m` : `${(c.distance / 1000).toFixed(1)} km`} (~${Math.max(1, Math.round(c.distance / 80))} min walk)`, sub: v.length ? `🟢 ${v.map(d => `${d.stall}: ${d.description}`).join(" · ")}` : sm.length ? `EXAMPLE only: ${sm[0]?.stall} — ${sm[0]?.description}` : "No checked deal right now" };
    });
    const text = verified.length ? `Good news! ${verified.length} volunteer-chopped deal${verified.length > 1 ? "s" : ""} near you. ${verified.map(d => `${d.stall} at ${d.centre_name}`).join(". ")}. ${t.verifiedWarning}` : `Here are the 4 closest official hawker centres. No volunteer-checked deal nearby right now, so please don't travel just for a deal. Examples are for testing only.`;
    setMessages(c => [...c, { id: nextId.current++, from: "bot", text, tag: verified.length ? "🟢 LIVE · VOLUNTEER CHOPPED" : "📍 REAL HAWKER CENTRES", category: "Food Rescue", time, options }]);
    setFeed(c => [{ id: nextId.current++, category: "Food Rescue", location: near[0]?.name ?? postal, urgency: verified.length ? "Live deal" : "No live deal", title: `Resident near ${postal} looking for meals`, detail: `Shown ${near.length} nearest NEA centres.`, time, assisted: false }, ...c]);
    setNotice(""); speak(text);
  }

  function locationFoodLookup(clean: string) {
    const time = timeNow();
    setMessages(current => [...current, { id: nextId.current++, from: "resident", text: clean, time }]);
    setDraft(""); setIntent(null); setNotice("Requesting your location to find nearby food…");
    if (!navigator.geolocation) {
      const text = "Location is not available on this device. Please tell me your estate or 6-digit postal code instead.";
      setMessages(current => [...current, { id: nextId.current++, from: "bot", text, category: "Food Rescue", time }]);
      setNotice(""); speak(text); return;
    }
    navigator.geolocation.getCurrentPosition(position => {
      const near = nearestCentres(position.coords.latitude, position.coords.longitude, 4);
      const options = near.map(centre => ({
        title: `${centre.name} · ${centre.distance < 1000 ? `${centre.distance} m` : `${(centre.distance / 1000).toFixed(1)} km`} (~${Math.max(1, Math.round(centre.distance / 80))} min walk)`,
        sub: "Official hawker centre · check stall hours and availability before going",
      }));
      const text = near.length ? "Here are the four closest official hawker centres using your current location. This does not mean a deal or stall is open, so please check before travelling." : "I could not find a nearby hawker centre. Please try your estate or postal code.";
      setMessages(current => [...current, { id: nextId.current++, from: "bot", text, tag: "📍 NEARBY FOOD", category: "Food Rescue", time, options }]);
      setNotice(""); speak(text);
    }, () => {
      const text = "I couldn't use your location. Please allow location access, or tell me your estate or 6-digit postal code.";
      setMessages(current => [...current, { id: nextId.current++, from: "bot", text, category: "Food Rescue", time }]);
      setNotice(""); speak(text);
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  }

  function nearbyReply(clean: string): boolean {
    const found = findNeighbourhood(clean);
    const wantsCc = intent === "cc" || (intent === null && /\bcc\b|event|screening|meet.the.people|mps|active ageing|programme/i.test(clean));
    const wantsWalk = !wantsCc && (intent === "walk" || /walk|jalan|exercise|brisk|dancerobics|dance|wushu|tai chi|taichi|karaoke|sing|kbox/i.test(clean));
    const wantsFood = !wantsCc && !wantsWalk && (intent === "food" || /food|meal|makan|hawker|lobang|eat|hungry/i.test(clean) || Boolean(found));
    if (!wantsFood && !wantsWalk && !wantsCc && intent !== null) return false;
    const time = timeNow();
    if (!found) {
      if (!intent) return false;
      const text = "Sorry, I couldn't find that area in the demo. Please try a 6-digit postal code like 460085, or an estate like Tampines.";
      setMessages(current => [...current, { id: nextId.current++, from: "resident", text: clean, time }, { id: nextId.current++, from: "bot", text, time }]);
      speak(text); return true;
    }
    if (!wantsFood && !wantsWalk && !wantsCc) return false;
    const { area, approximate, postal } = found;
    const where = `${approximate ? "Closest area to " + postal : area.name}`;
    const options = wantsFood
      ? area.stalls.map(stall => ({ title: `${stall.name} — ${stall.dish} · ${stall.price}`, sub: `${area.centre}${stall.diet ? ` · declared ${stall.diet}` : ""}`, diet: stall.diet }))
      : wantsCc ? [
          { title: `Active Ageing programme · ${area.cc}`, sub: "Mon & Wed 9:00am, line dance, craft and tea" },
          { title: `Free health screening · ${area.cc}`, sub: "Sat 8:30am–12pm, blood pressure, sugar & eye check" },
          { title: `Meet-the-People Session · ${area.cc}`, sub: "Mon 7:30pm, bring your letters for help" },
          { title: `Kampung makan & mahjong · ${area.cc}`, sub: "Fri 2:00pm, all neighbours welcome" },
        ] : [
          { title: `Morning brisk walk · ${area.park}`, sub: `Tue & Thu 7:30am, meet at ${area.cc}` },
          { title: `Dancerobics · ${area.cc}`, sub: "Mon & Sat 9:00am, all kakis welcome" },
          { title: `Wushu & tai chi · ${area.cc}`, sub: "Wed 8:00am, gentle pace" },
          { title: `Karaoke & kopi · ${area.cc}`, sub: "Fri 2:00pm, sing or just listen" },
        ];
    const text = wantsCc ? `${where}${approximate ? ` (${area.name})` : ""}: here are regular happenings at ${area.cc}. Please confirm dates with the CC counter or onePA before going.` : wantsFood
      ? `${where}${approximate ? ` (${area.name})` : ""}: here are today's neighbourhood deal leads near ${area.centre}. Please confirm availability and closing time with each shop before travelling.`
      : `${where}${approximate ? ` (${area.name})` : ""}: here are regular activities near ${area.cc}. Please check with ${area.cc} before going.`;
    const category: Category = wantsFood ? "Food Rescue" : wantsCc ? "Community Request" : "Senior Activity";
    const id = nextId.current++;
    setMessages(current => [...current, { id, from: "resident", text: clean, time }, { id: nextId.current++, from: "bot", text, tag: wantsFood ? "🍲 MEAL LOBANG" : wantsCc ? "🏛️ CC EVENTS" : "🤝 ACTIVITIES", category, time, options }]);
    setFeed(current => [{ id, category, location: area.name, urgency: "Community", title: wantsFood ? `Resident looking for meals in ${area.name}` : wantsCc ? `Resident asking about CC events in ${area.name}` : `Resident looking for an activity group in ${area.name}`, detail: wantsFood ? `Shown stalls at ${area.centre}.` : wantsCc ? `Shown events at ${area.cc}.` : `Shown activities around ${area.cc}.`, time, assisted: false }, ...current]);
    if (wantsFood) setMessages(current => [...current, { id: nextId.current++, from: "bot", text: `Also coming up at ${area.cc}:`, tag: "🏛️ UPCOMING EVENTS", category: "Community Request", time, options: [{ title: "Free health screening", sub: "Sat 8:30am–12pm" }, { title: "Active Ageing programme", sub: "Mon & Wed 9:00am" }] }]);
    setDraft(""); setIntent(null);
    setNotice("Added to the demo dispatch board.");
    speak(`${text} ${options.slice(0, 4).map(option => option.title.split(" — ")[0]).join(". ")}.`);
    return true;
  }

  useEffect(() => { if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight; }, [messages]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setHeaderLanguageIndex(index => (index + 1) % languages.length), 3000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => { try { setShowHint(sessionStorage.getItem("lobangkaki-hint-seen") !== "yes"); } catch { setShowHint(true); } }, []);
  useEffect(() => { document.documentElement.lang = languages.find(item => item.id === language)?.speech ?? "en-SG"; return () => { document.documentElement.lang = "en"; }; }, [language]);
  useEffect(() => () => { recognitionRef.current?.stop(); window.speechSynthesis?.cancel(); }, []);

  function speak(text: string) {
    if (!voiceOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languages.find(item => item.id === language)?.speech ?? "en-SG";
    utterance.rate = 0.88;
    utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
  }

  function chooseLanguage(next: ResidentLanguage) {
    recognitionRef.current?.stop(); setRecording(false);
    window.speechSynthesis?.cancel();
    setLanguage(next);
    setMessages(current => current.map(message => {
      if (message.id === 1) return { ...message, text: copy[next].greeting };
      if (message.from !== "bot" || message.options || ["🍲 MEAL LOBANG", "🏛️ CC & KAMPUNG EVENTS", "🤝 FIND A GROUP", "🏛️ UPCOMING EVENTS"].includes(message.tag ?? "")) return message;
      if (message.tag === "⌛ DEAL EXPIRED") return { ...message, text: copy[next].expired };
      if (message.tag === "⚠️ LISTING WITHDRAWN") return { ...message, text: copy[next].withdrawn };
      if (message.category === "Senior Activity") return { ...message, text: copy[next].walkReply };
      if (message.category === "Food Rescue" && message.dealId === undefined) return { ...message, text: copy[next].foodWarning };
      if (message.category === "Community Request") return { ...message, text: copy[next].otherReply };
      return message;
    }));
    setNotice("");
    if (voiceOn && window.speechSynthesis) {
      const greeting = new SpeechSynthesisUtterance(copy[next].greeting);
      greeting.lang = languages.find(item => item.id === next)?.speech ?? "en-SG";
      greeting.rate = 0.88;
      window.speechSynthesis.speak(greeting);
    }
  }

  function send(text = draft) {
    const clean = text.trim();
    if (!clean) return;
    if (clean.length > 1000) { setNotice("Please keep your message under 1,000 characters."); return; }
    if (/find\s+(?:me\s+)?(?:a\s+)?place\s+to\s+eat|where\s+(?:can|should)\s+i\s+eat|food\s+near\s+me|nearby\s+(?:food|hawker)/i.test(clean)) { locationFoodLookup(clean); return; }
    if (nearbyReply(clean)) return;
    const result = classify(clean);
    setIntent(null);
    const translated = result.category === "Food Rescue" ? t.foodWarning : result.category === "Senior Activity" ? t.walkReply : t.otherReply;
    const id = nextId.current++;
    const time = timeNow();
    setMessages(current => [...current, { id, from: "resident", text: clean, time }, { id: nextId.current++, from: "bot", text: translated, tag: result.tag, category: result.category, time }]);
    setFeed(current => [{ id, category: result.category, location: result.location, urgency: result.urgency, title: result.title, detail: result.detail, time, assisted: false }, ...current]);
    setDraft("");
    setNotice("Added to the demo dispatch board.");
    if (result.category !== "Food Rescue") speak(translated);
  }

  function toggleRecording() {
    if (recording) { recognitionRef.current?.stop(); setRecording(false); return; }
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) { setNotice("Voice input is not available in this browser. Please type or try a demo message."); return; }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = languages.find(item => item.id === language)?.speech ?? "en-SG";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = event => { const transcript = event.results[0]?.[0]?.transcript; if (transcript) { setDraft(transcript); setTextOpen(true); setNotice("Voice note transcribed. Check it, then press send."); } };
      recognition.onerror = event => { setNotice(event.error === "not-allowed" ? "Microphone access was blocked. Please type your message instead." : "Could not hear that clearly. Please try again or type your message."); setRecording(false); };
      recognition.onend = () => setRecording(false);
      recognitionRef.current = recognition;
      recognition.start();
      setRecording(true);
      setNotice("Listening… speak clearly into your microphone.");
    } catch { setNotice("Could not start the microphone. Please type your message instead."); setRecording(false); }
  }

  async function shareLobang(message: Message) {
    const text = `LobangKaki 🦦\n${message.text}\n${(message.options ?? []).map((o, i) => `${i + 1}. ${o.title}\n   ${o.sub}`).join("\n")}`;
    try {
      if (navigator.share) { await navigator.share({ title: "LobangKaki lobang", text }); return; }
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    } catch { /* share cancelled */ }
  }

  function assist(id: number) { setFeed(current => current.map(item => item.id === id ? { ...item, assisted: !item.assisted } : item)); }
  function dismissHint() { setShowHint(false); try { sessionStorage.setItem("lobangkaki-hint-seen", "yes"); } catch { /* continue without browser storage */ } }

  const header = <div className="flex items-center gap-3 px-4 pb-1 pt-3">
    <img src={otterLogo} alt="LobangKaki otter mascot" width={44} height={44} className="size-11 shrink-0 object-contain" />
    <div className="min-w-0"><div className="truncate text-lg font-extrabold leading-tight">LobangKaki <span className="font-medium">甘榜通</span></div><div className="min-h-5 text-xs font-semibold text-muted-foreground"><span className="sr-only">Available languages: {languages.map(item => item.label).join(", ")}</span><span key={headerLanguageIndex} className="header-language-fade inline-block" aria-hidden="true">{languages[headerLanguageIndex]?.label}</span></div></div>
  </div>;
  const walkStats = <section aria-labelledby="walk-stats" className="mt-8">
    <h2 id="walk-stats" className="font-display text-2xl font-bold">Built for Singapore's walkable towns</h2>
    <p className="mt-1 text-sm text-muted-foreground">Deals only reach people who can walk there, because HDB towns are planned around nearby food and community centres.</p>
    <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
      {[["123", "official NEA hawker centres grounded from Data.gov.sg"], ["~690 m", "median distance from one centre to its nearest neighbour (≈ 9 min walk)*"], ["67%", "of centres have another within 800 m, a 10-minute walk*"], ["~78%", "of resident households live in HDB flats (SingStat 2023)"]].map(([n, l]) => <div key={n} className="rounded-2xl bg-secondary p-4"><strong className="block text-2xl font-extrabold text-primary">{n}</strong><span className="mt-1 block text-xs leading-snug text-muted-foreground">{l}</span></div>)}
    </div>
    <p className="mt-2 text-xs text-muted-foreground">*Computed from the bundled Data.gov.sg dataset at ~80 m per minute walking pace. Walking radius used by the app: 5–10 minutes (≈ 400–800 m).</p>
  </section>;
  const board = <section aria-label="Community volunteer board">
    <div className="mb-3 flex items-end justify-between"><div><p className="mb-1 text-xs font-extrabold uppercase text-primary">VOLUNTEER BOARD</p><h2 className="font-display text-2xl font-bold">Neighbourhoods that care.</h2></div><span className="flex items-center gap-1.5 text-xs font-bold text-primary"><span className="size-2 animate-pulse rounded-full bg-primary" /> LIVE</span></div>
         <div className="border-b border-border px-2 py-4"><DealStickerGrid value={dealCat} onChange={setDealCat} /><p className="mt-3 rounded-2xl bg-food/40 px-4 py-2.5 text-center text-xs font-bold text-food-foreground">Each lobang is only shown to neighbours within walking distance of that hawker centre — no island-wide wild goose chases.</p></div>{feed.length === 0 ? null : <div className="space-y-3 pt-4">{feed.map(item => <article key={item.id} className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5"><div className="flex flex-wrap items-center justify-between gap-2"><span className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-extrabold ${item.category === "Food Rescue" ? "bg-warning text-warning-foreground" : "bg-secondary text-primary"}`}>{item.category === "Food Rescue" ? <Soup className="size-3.5" /> : <Footprints className="size-3.5" />}{item.category}</span><span className="text-xs font-semibold text-muted-foreground">{item.time}</span></div>{stickerFor(item.category) && <ActionSticker kind={stickerFor(item.category) as StickerKind} compact callout={item.category === "Food Rescue" ? "Stall check first!" : undefined} />}<h4 className="mt-3 text-lg font-bold">{item.title}</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p><div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="size-3.5" />{item.location}</span><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-primary" />{item.urgency}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><span className="flex items-center gap-1 text-xs font-bold text-muted-foreground"><BadgeCheck className="size-4" /> {item.category === "Food Rescue" ? "Needs 1 volunteer verification" : "Community request · demo only"}</span>{item.category !== "Food Rescue" && <Button variant={item.assisted ? "secondary" : "default"} onClick={() => assist(item.id)} className="h-11 text-sm">{item.assisted ? "Assistance marked" : "Claim & Assist Neighbour"}{!item.assisted && <ChevronRight />}</Button>}</div></article>)}</div>}
    <DealIntegrity cat={dealCat} />
  </section>;
  const about = <div className="space-y-3 text-sm text-muted-foreground"><div className="flex flex-wrap gap-2">{["MIT License", "$0 stack", "Open source", "No sign-in"].map(b => <span key={b} className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">{b}</span>)}</div><p>Browser voice availability varies by device; Hokkien uses a Mandarin fallback.</p><p>LobangKaki is an open-source community project. Contributions are welcome on <a href="https://github.com/evecount/lobangkaki" target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>.</p><p className="font-medium text-foreground">Made with <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline">Lovable</a></p></div>;
  const privacyTerms = <section aria-labelledby="privacy-terms" className="rounded-md border border-primary/20 bg-card p-3">
    <div className="flex items-center gap-2"><ShieldCheck className="size-5 shrink-0 text-primary" /><h2 id="privacy-terms" className="font-display text-sm font-extrabold">Zero-PII resident promise</h2></div>
    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">No account, name, phone number, NRIC or personal profile is requested. Messages and actions are an in-browser festival demo and are not tied to an identity. Camera and location permission are requested only when someone chooses to share and ground a meal tip.</p>
  </section>;
  const navItems = [{ id: "chat" as const, label: "Chat", icon: MessageCircle }, { id: "deals" as const, label: "Live deals", icon: Users }, { id: "about" as const, label: "About", icon: Info }];

  return <main className="flex h-dvh overflow-hidden bg-background text-foreground md:bg-secondary">
    <div className="mx-auto flex h-full w-full items-center justify-center p-0 md:p-4">
    <div className="relative flex h-dvh w-full flex-col bg-background md:h-full md:max-h-[900px] md:w-auto md:aspect-[9/19.5] md:min-w-[250px] md:shrink-0 md:overflow-hidden md:rounded-[2.75rem] md:border-8 md:border-foreground md:shadow-2xl lg:min-w-[280px] xl:min-w-[300px]" aria-label="Interactive LobangKaki mobile experience inside a phone frame">
      <div className="pointer-events-none absolute left-1/2 top-2 z-10 hidden h-5 w-28 -translate-x-1/2 rounded-full bg-foreground md:block" aria-hidden="true" />
      <div className="shrink-0 md:pt-7">{header}</div>
      <div className={tab === "chat" ? "flex min-h-0 flex-1 flex-col px-3" : "hidden"}>
         <div className="mb-3" aria-label="Food, CC events and group activity picture shortcuts"><div className="grid grid-cols-3 gap-2">{demos.map((demo, index) => <Button key={demo.label} variant="ghost" onClick={() => pickSticker(demo.kind)} data-kind={demo.kind} className={`sticker-demo-button h-auto flex-col justify-center gap-0 whitespace-normal rounded-full border-0 bg-transparent px-1 py-1 text-center text-sm font-bold leading-tight shadow-none hover:bg-transparent focus-visible:bg-transparent sm:text-base min-h-24`}>{index === 2 ? <GroupSticker compact /> : <ActionSticker kind={demo.kind} compact callout={demo.kind === "food" ? "Stall check first!" : undefined} />}<span className="mt-1">{index === 0 ? t.food : index === 1 ? t.cc : t.walk}</span></Button>)}</div><Button type="button" variant="outline" onClick={() => { setIntent(null); setTab("deals"); }} className="mt-2 min-h-12 w-full rounded-full border-primary/40 text-base font-bold text-primary hover:bg-primary/10 hover:text-primary">🛍️ {t.deals}</Button></div>
           <div ref={chatScrollRef} className={`flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-2 `} aria-live="polite" aria-label="Conversation">
            <div className="mx-auto text-xs font-semibold uppercase tracking-wide text-muted-foreground">TODAY · YOUR CONVERSATION IS A DEMO</div>
             {messages.filter(message => message.dealId === undefined || message.category !== "Food Rescue" || mealDiet === "all" || message.diet === mealDiet).map(message => <div key={message.id} className={`flex ${message.from === "resident" ? "justify-end" : "justify-start"}`}><div className={`max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[83%] ${message.from === "resident" ? "bg-message-out text-foreground" : "bg-secondary text-foreground"}`}>
                {message.category && stickerFor(message.category) && <ActionSticker kind={stickerFor(message.category) as StickerKind} compact callout={message.category === "Food Rescue" && message.tag !== "🟢 LOBANGKAKI VERIFIED · DEMO" ? "Stall check first!" : undefined} />}
               {message.tag && <div className={`mb-2 inline-flex rounded-sm px-2 py-1 text-[11px] font-extrabold tracking-wide ${message.category === "Food Rescue" ? "bg-food text-food-foreground" : "bg-secondary text-primary"}`}>{message.tag}</div>}
              <p className={`whitespace-pre-wrap leading-relaxed text-xl`}>{message.text}</p>{message.options && <ol className="mt-3 space-y-2">{message.options.filter(option => mealDiet === "all" || message.category !== "Food Rescue" || option.diet === mealDiet).map((option, index) => <li key={option.title} className="rounded-sm border border-border bg-background px-3 py-2"><div className={`font-bold text-lg`}>{index + 1}. {option.title}</div><div className="text-sm text-muted-foreground">{option.sub}</div></li>)}{message.category === "Food Rescue" && mealDiet !== "all" && !message.options.some(option => option.diet === mealDiet) && <li className="text-sm text-muted-foreground">No stall here has declared this diet.</li>}</ol>}{message.from === "bot" && message.options && <Button type="button" onClick={() => shareLobang(message)} className="mt-3 h-12 w-full rounded-full text-base"><Share2 />Share this lobang</Button>}<div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">{message.time}{message.from === "resident" && <CheckCheck className="size-4 text-tick" aria-label="Delivered" />}</div>
            </div></div>)}
          </div>
          {textOpen && <form onSubmit={event => { event.preventDefault(); send(); }} className="flex shrink-0 items-end gap-2 pb-2"><label htmlFor="message" className="sr-only">{t.placeholder}</label><textarea id="message" autoFocus value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder={t.placeholder} rows={1} maxLength={1000} className="min-h-12 max-h-28 min-w-0 flex-1 resize-none rounded-full border border-border bg-background px-4 py-3 text-lg leading-snug outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /><Button type="submit" size="icon" aria-label={t.send} disabled={!draft.trim()} className="size-12 shrink-0 rounded-full"><Send className="!size-5" /></Button></form>}
          {notice && <p className="shrink-0 pb-1 text-center text-sm font-medium text-muted-foreground" role="status">{notice}</p>}
      </div>
      <div className={tab === "deals" ? "min-h-0 flex-1 overflow-y-auto px-4 pb-4" : "hidden"}>{board}</div>
      <div className={tab === "about" ? "min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-4" : "hidden"}>
         {showHint && <div className="mt-4 flex items-start gap-3 border-l-4 border-primary bg-secondary px-3 py-2 text-sm text-foreground" role="note"><p className="min-w-0 flex-1">{language === "zh" ? "按麦克风说话，或点键盘输入消息。下方可选择语言和饮食；食物消息请先核实。" : language === "ms" ? "Tekan mikrofon atau ikon papan kekunci untuk menaip. Pilih bahasa dan makanan di bawah; semak tawaran sebelum pergi." : language === "ta" ? "ஒலிவாங்கியைத் தட்டி பேசுங்கள் அல்லது விசைப்பலகையைத் தட்டி எழுதுங்கள். கீழே மொழியும் உணவும் தேர்வு செய்யலாம்." : "Tap the microphone to speak, or the keyboard icon to type. Choose your language and meal preferences below; check deals before travelling."}</p><Button type="button" variant="ghost" onClick={dismissHint} className="min-h-11 shrink-0 px-2 text-sm" aria-label="Dismiss first-visit hint">Got it</Button></div>}
         <div className="mt-4"><div className="mb-2 text-base font-bold text-foreground" id="language-label">Language / 语言 / Bahasa / மொழி</div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-labelledby="language-label">{languages.map(option => <Button key={option.id} type="button" variant={language === option.id ? "default" : "outline"} aria-pressed={language === option.id} onClick={() => chooseLanguage(option.id)} className="h-auto min-h-12 whitespace-normal px-2 py-2 text-center text-base leading-tight">{option.label}</Button>)}</div></div>
         <div className="mt-4"><div className="mb-2 text-base font-bold text-foreground" id="diet-label">{t.diet}</div><div className="flex flex-wrap gap-2" role="group" aria-labelledby="diet-label">{(["all", "halal", "vegetarian"] as const).map(option => <Button key={option} type="button" variant={mealDiet === option ? "default" : "outline"} aria-pressed={mealDiet === option} onClick={() => { setMealDiet(option); window.speechSynthesis?.cancel(); }} className="min-h-12 whitespace-normal px-3 text-base">{option === "all" ? t.all : option === "halal" ? t.halal : t.vegetarian}</Button>)}</div><p className="mt-2 text-sm text-muted-foreground" role="status">{suitableMeals.length ? `${suitableMeals.length} ${language === "zh" ? "份已检查的餐食" : language === "ms" ? "hidangan telah disemak" : language === "ta" ? "சரிபார்த்த உணவு" : "checked meal(s) in this demo"}. ${language === "en" ? "Confirm ingredients with the stall." : ""}` : t.empty}</p></div>
         <Button type="button" variant="outline" onClick={() => { setVoiceOn(!voiceOn); if (voiceOn) window.speechSynthesis?.cancel(); }} className="min-h-12 w-full text-base">{voiceOn ? <><Volume2 />Spoken replies on</> : <><VolumeX />Spoken replies off</>}</Button>
         {walkStats}
         {privacyTerms}
        {about}
      </div>
      <nav className="relative grid shrink-0 grid-cols-5 items-end border-t border-border bg-background pb-[env(safe-area-inset-bottom)]" aria-label="App sections">
        {navItems.slice(0, 2).map(item => <button key={item.id} type="button" onClick={() => setTab(item.id)} aria-current={tab === item.id ? "page" : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold ${tab === item.id ? "text-primary" : "text-muted-foreground"}`}><item.icon className="size-6" />{item.label}</button>)}
        <div className="flex justify-center"><button type="button" onClick={() => { setTab("chat"); toggleRecording(); }} aria-label={recording ? t.stop : t.record} className={`-mt-8 flex size-20 items-center justify-center rounded-full border-4 border-background shadow-lg ${recording ? "animate-pulse bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}>{recording ? <MicOff className="size-9" /> : <Mic className="size-9" />}</button></div>
        <button type="button" onClick={() => setTab("about")} aria-current={tab === "about" ? "page" : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold ${tab === "about" ? "text-primary" : "text-muted-foreground"}`}><Info className="size-6" />More</button>
        <button type="button" onClick={() => { setTab("chat"); setTextOpen(o => !o); }} aria-label={textOpen ? "Hide text message" : "Type a text message"} aria-expanded={textOpen} className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold ${textOpen ? "text-primary" : "text-muted-foreground"}`}><Keyboard className="size-6" />Type</button>
      </nav>
    </div>
    </div>
  </main>;
}
