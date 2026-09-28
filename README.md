# LobangKaki (甘榜通)

> A voice-first, no-sign-in community assistant for Singapore neighbourhoods — meal lobang, community club events, and activity groups, in four languages.

**License:** MIT · **Cost to run:** $0 (browser-native APIs) · **Stack:** React 19 + TanStack Start + Tailwind CSS v4

**Live demo:** https://lobangkaki.lovable.app · **Source:** https://github.com/evecount/lobangkaki

---

## What it is

LobangKaki ("lobang" = Singlish for a good deal or opportunity, "kaki" = buddy) is a WhatsApp-style assistant built for residents who are excluded by app stores, logins, and English-only portals — especially seniors.

- **No account, no download, no personal identifiers.** Open the page and talk.
- **Voice-first.** Speak in English/Singlish, Mandarin (Hokkien label falls back to Mandarin speech), Malay, or Tamil; replies are read aloud.
- **Hyperlocal.** Meal deals and activities are grounded to real NEA hawker centres and shown only within walking distance.

The current build is a **client-side simulation**: nothing persists and no message reaches a real volunteer. See [Roadmap](#roadmap).

## Safety model: no phantom deals

The core design problem is trust without logins. A prank "free food" tip can send an elderly resident on a wasted, demoralising trip. LobangKaki's answer:

1. **Physical grounding** — a deal requires a live stall photo plus a location check within ~100 m of the stall before it can enter the verification queue.
2. **Community chop** — listings start as `🟡 Pending`; only a volunteer-checked listing is ever spoken as verified. Chat tips are never voiced as real offers.
3. **Anomaly tally** — listings flagged twice are withdrawn automatically.
4. **Zero PII for seniors** — no name, phone number, NRIC, or profile is ever requested. Camera/location permissions are asked only when someone chooses to ground a deal.

Dietary filters (halal, vegetarian) use only explicit poster declarations — never text guesses — and always tell residents to confirm ingredients with the stall.

## Sticker pack 🎨

All 21 hand-illustrated stickers used in the app — the mascot, food categories, activity groups, and the maker sticker — are free to download and reuse (MIT, same as the code):

**[⬇️ Download the LobangKaki sticker pack (ZIP, ~23 MB)](https://lobangkaki.lovable.app/__l5e/assets-v1/9ef2c0cd-c6d2-4920-8b57-d84da011d62e/lobangkaki-stickers.zip)**

Individual PNGs also live in [`src/assets/`](src/assets/) if you just want one or two.

## Features

- **Chat simulator** with voice input (Web Speech API) and spoken replies (`speechSynthesis`)
- **Live Deals board** — 12 food categories with volunteer-verification flow, deal expiry, and withdrawal
- **Neighbourhood lookup** — 24 Singapore estates plus 6-digit postal codes, grounded to 123 real hawker centres from Data.gov.sg
- **"Find food near me"** — one-tap geolocation to the four nearest official hawker centres
- **CC events & activity groups** — walking, dancerobics, wushu, karaoke, health screenings
- **Share a lobang** — Web Share API with WhatsApp fallback
- **Accessible by default** — large type, high contrast, reduced-motion support, screen-reader labels

## Tech stack

| Layer | Choice | Why |
| :--- | :--- | :--- |
| Framework | React 19 + TanStack Start (Vite 7) | SSR-capable, file-based routing |
| Styling | Tailwind CSS v4 + shadcn/ui | Token-based theming |
| Speech | Browser Web Speech API | $0, zero latency, no keys |
| Data | Bundled Data.gov.sg hawker centre dataset | Works offline, no backend needed |
| Hosting | Lovable | Free tier |

## Quick start

```bash
git clone https://github.com/evecount/lobangkaki.git
cd lobangkaki
npm install
npm run dev
```

Open http://localhost:5173 and grant microphone permission if you want voice input.

## Project structure

```
src/
  routes/           # TanStack file routes (/, /readme)
  components/       # UI, deal integrity, sticker grid
  lib/              # neighbourhoods, hawker centres, resident language copy, live deals
  assets/           # illustrated stickers and mascot
```

## Roadmap

- [ ] Real backend for deal persistence and volunteer dispatch
- [ ] WhatsApp/Telegram bot ingress for residents without smartphones
- [ ] Dialect speech models beyond browser capabilities
- [ ] Partnership pilot with a Community Club

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Please be kind; this project is for seniors and neighbours, and the tone of the code review should match.

## License

MIT — see [LICENSE](LICENSE).
