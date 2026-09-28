<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS.md

LobangKaki (甘榜通) is a voice-first, no-sign-in community assistant for
Singapore seniors excluded by app stores, logins, and English-only portals.
Standalone open-source (MIT); hackathon branding, judge panel, and pitch deck
were removed — do not re-add them.

## Safety model — load-bearing, never break

- No phantom deals: chat tips are never spoken as verified offers. Only a
  listing grounded by live stall photo + ~100 m location check can enter the
  demo volunteer check; listings start `🟡 Pending`; two flags withdraw one.
- Zero PII for seniors: never request name, phone, NRIC, or profile.
- Dietary filters use only explicit poster declarations, never text guesses;
  always tell residents to confirm with the stall.
- Deal expiry uses a client-side deadline + periodic wall-clock check, so
  stale verified audio is withdrawn even after a suspended tab resumes.

## Current state

Client-only, in-memory simulator: nothing persists, no message reaches a real
volunteer, no backend by design. Neighbourhood meal offers are synthetic
examples — never present them as real deals. Hawker centre data is real
(bundled from Data.gov.sg).

## Stack and layout

React 19 + TanStack Start (Vite 7), Tailwind v4 + shadcn/ui, browser Web
Speech API ($0, no keys — degrade gracefully). `src/routes/` (/, /readme),
`src/lib/` (neighbourhoods, hawker centres, locale copy, live deals),
`src/assets/` (21 MIT stickers), `docs/index.html` (Pages landing).

- Resident language lives in a shared locale-copy module; extend it there.
  Hokkien label falls back to Mandarin speech.
- In-app README imports the project README — keep both in sync.
- Desktop: centered viewport-height phone frame + small maker card; no side
  panel; no clipping at short viewports.
- Quick actions stay immediately before the chat transcript; project info
  after the experience.

Owner: Gwendalynn Lim Wan Ting; Windows, no local Git — push via GitHub API.
Live: lobangkaki.lovable.app · Repo: github.com/evecount/lobangkaki
