import { useEffect, useState } from "react";
import food from "@/assets/sticker-food.png";
import walk from "@/assets/sticker-walk.png";
import cc from "@/assets/sticker-cc.png";
import dancerobics from "@/assets/sticker-dancerobics.png";
import wushu from "@/assets/sticker-wushu.png";
import karaoke from "@/assets/sticker-karaoke.png";

export type StickerKind = "food" | "walk" | "cc" | "dance" | "wushu" | "karaoke";

const stickers = {
  food: { image: food, callout: "Hot Food Ready!", alt: "Smiling bowl of chicken rice" },
  cc: { image: cc, callout: "What's On at CC?", alt: "Smiling community club building with bunting and a calendar" },
  walk: { image: walk, callout: "Jom Jalan-Jalan!", alt: "Three neighbours brisk walking together as a group" },
  dance: { image: dancerobics, callout: "Dance fit, kakis!", alt: "Three neighbours doing dancerobics together" },
  wushu: { image: wushu, callout: "Wushu, anyone?", alt: "Three neighbours practising wushu in the park" },
  karaoke: { image: karaoke, callout: "Sing along!", alt: "Three neighbours singing karaoke at the CC" },
};

// "Find a group" cycles through the activities picky kakis actually ask for.
const groupRotation: StickerKind[] = ["walk", "dance", "wushu", "karaoke"];

export function ActionSticker({ kind, compact = false, callout }: { kind: StickerKind; compact?: boolean; callout?: string | undefined }) {
  const sticker = stickers[kind];
  return <span className={`action-sticker action-sticker--${kind} ${compact ? "action-sticker--compact" : ""}`}>
    <img src={sticker.image} alt={sticker.alt} width={1024} height={1024} loading="lazy" />
    <span className="sticker-callout">{callout ?? sticker.callout}</span>
  </span>;
}

// Crossfade instead of remounting: the outgoing sticker fades out while the
// next one fades in on top, so the sticker never vanishes between activities.
export function GroupSticker({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % groupRotation.length), 3000);
    return () => window.clearInterval(timer);
  }, []);
  const current = groupRotation[index] ?? "walk";
  return <span className="sticker-cycle">
    {groupRotation.map(kind => (
      <span key={kind} className={`sticker-cycle__layer ${kind === current ? "sticker-cycle__layer--active" : ""}`} aria-hidden={kind === current ? undefined : true}>
        <ActionSticker kind={kind} compact={compact} />
      </span>
    ))}
  </span>;
}
