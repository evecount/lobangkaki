# LobangKaki (甘榜通) • Dignity by Design

> **Headless Social Infrastructure for the Next Billion Users of AI.**  
> Built for the **SAIA A.I. Festival 2026: Hack for Humanity (H4H)**.  
> **License:** MIT (Open by Default) | **Budget:** $0 (Free Web APIs + Lovable AI Edge)

Made with [Lovable](https://lovable.dev) for [Hack for Humanity](https://www.aicollective.com/h4h).

---

## 🌟 The Vision: Social Infrastructure, Not Another App

The next billion users of AI will not prompt LLMs through text boxes or navigate complex English SaaS portals. In Singapore, vulnerable seniors and low-literacy residents already experience digital exclusion when trying to claim municipal subsidies, read official letters, or access affordable daily meals.

**LobangKaki** is headless social infrastructure that operates through familiar channels—such as WhatsApp voice notes and audio dialogues. It translates fragmented dialect voice notes into verified community action with **zero user logins, zero personal identifiers, and zero API costs**.

---

## 🎯 Alignment with Hackathon Themes

| Challenge Pillar | Problem Solved | In-App Feature & Implementation |
| :--- | :--- | :--- |
| **💚 Silver Connections** | Seniors isolated from daily support and activities. | **Zero-Text Dialect Voice Ingress:** Seniors speak naturally in Singlish/Hokkien/Malay/Mandarin; browser native Web Speech API converts dialect to intent. |
| **💛 Neighbourhoods That Care** | Food surplus wasted while seniors struggle with food costs. | **Hyperlocal Mutual Aid Mesh:** Hawkers broadcast surplus meals ($2 or free); nearby volunteers verify and escort delivery. |
| **💙 Kinder Digital World** | Confusing official letters and cold, jargon-heavy portals. | **Kind Language Engine:** Calm, plain-spoken audio readbacks translate bureaucratic notices into reassuring, everyday words. |
| **✨ Dignity by Design** | Portals requiring complex logins, passwords, and Singpass. | **100% Identifier-Free Dignity:** Zero login, zero phone tracking, and respectful audio readbacks that never treat seniors like tickets. |
| **🌏 No One Left Behind** | Tech requiring expensive phones, subscriptions, or credit cards. | **$0 Stack, Open Web Native:** Runs purely on in-browser speech synthesis, lightweight React client state, and MIT-licensed open infrastructure. |

---

## 🛡️ Anti-Prank & Phantom Deal Guardrails (Dignity Without Logins)

A major risk in community-driven aid is **malicious pranks**—sending an elderly resident to a hawker stall only to find no food exists. To solve this without imposing tracking or logins on seniors:

1. **Physical Grounding:** Deals require an in-situ snapshot of the stall with local geohash validation before entering the broadcast queue.
2. **Community Double-Chop (Verification):** All new listings enter as `🟡 Pending Stall Check`. Only after a nearby grassroots volunteer or neighboring stallholder taps `🟢 LobangKaki Verified` is the listing read out to seniors.
3. **Transient Anomaly Tally:** Devices repeatedly posting phantom deals or flagged twice by community members are automatically dropped from the broadcast pool and increment an integrity tally.
4. **Verified Audio Receipts:** When reading a deal to an elderly resident, the AI voice explicitly confirms: *"Auntie, this stall at Blk 208 was verified 10 minutes ago by volunteer Sarah. Safe to collect."*

---

## 🚀 Key Features

* **Dual-View Architecture:**
  * **Resident WhatsApp Simulator:** High-contrast, authentic messaging UI with live audio waveform recording and warm `speechSynthesis` audio playback.
  * **Community Dispatch Terminal:** Real-time visibility into structured JSON webhook payloads, urgent requests, and volunteer task claiming.
* **Instant Demo Mode:** 3 one-click scenarios for noisy demo halls:
  1. *Hawker Surplus:* Maxwell Chicken Rice surplus packs for CHAS Blue cardholders.
  2. *CC & Kampung Events:* Active ageing programmes and health screenings at the community club.
  3. *Silver Companion:* Connecting to a walking group at Ang Mo Kio CC.

---

## 🛠️ Architecture & Tech Stack

```
[Resident Voice Note / Presets] 
               │
               ▼
[Browser Native SpeechRecognition] 
               │
               ▼
[Lovable AI Edge Gateway (Intent & De-escalation Parser)]
               │
      ┌────────┴────────┐
      ▼                 ▼
[Warm Audio SpeechSynthesis]   [Headless Community Webhook]
(Resident Readback)            (Grassroots Dispatch Board)
```

* **Platform:** Built and deployed with [Lovable.dev](https://lovable.dev)
* **Speech-to-Text:** Native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
* **Text-to-Speech:** Native In-Browser `window.speechSynthesis` (Zero latency, $0 cost)
* **License:** MIT Open Source License

---

## 🏃 Quick Start (Local Run)

```bash
# Clone the repository
# Repository URL to be supplied by project owner
# Clone your LobangKaki repository here

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open `http://localhost:5173` in your browser. Ensure your microphone permissions are granted.

---

## ⚖️ Hackathon Compliance
- **Rule 1 (Teams of 1-4):** Solo/Team Sprint for SAIA AI Festival.
- **Rule 2 (Start from Zero):** Conceived and built from 2:30 PM to 5:30 PM.
- **Rule 3 (Open by Default):** Fully open-source under MIT license.
- **Rule 4 (Spend $0):** Leveraged 100% free web standards and Lovable AI tier.
---

## Resident language and meal preferences

The resident view offers one-tap English/Singlish, Mandarin (Hokkien-label fallback), Malay, and Tamil choices. Browser speech recognition and spoken replies request the closest supported locale; actual language/voice availability varies by browser and device. The greeting and core safety replies follow the selected language. The halal and vegetarian/vegan meal filters only show matching poster-declared, volunteer-checked deals. Dietary declarations and demo volunteer taps are not independently certified; confirm ingredients and availability directly with the stall. No name or identifier is requested.
