# Contributing to LobangKaki

Thanks for wanting to help! LobangKaki exists so that seniors and low-literacy residents can reach community help without logins, downloads, or English-only forms. Every contribution should keep that bar.

## Ground rules

1. **No phantom deals.** Never let an unverified tip be presented or spoken as a real offer. Verification (photo + location + volunteer chop) must stay ahead of any resident-facing claim.
2. **Zero PII for residents.** Do not add accounts, phone numbers, NRIC, tracking, or analytics that identify residents.
3. **$0 and open.** Prefer browser-native APIs and free tiers. No required paid services.
4. **Plain language.** Resident-facing copy must be short, warm, and translatable. Safety replies live in `src/lib/resident-language.ts` — add translations for all four languages when you change copy.
5. **Dietary claims need explicit declarations.** Never infer halal/vegetarian status from text.

## Development

```bash
npm install
npm run dev
```

- Routes live in `src/routes/` (TanStack Start file routing). Don't edit `src/routeTree.gen.ts`.
- Styles use Tailwind v4 tokens in `src/styles.css` — use semantic tokens, not hardcoded colors.
- The app is currently a client-side simulation; keep demo data clearly labelled as examples.

## Pull requests

- Describe the resident-facing change in plain words.
- Test at mobile width (the app is mobile-first) and with `prefers-reduced-motion`.
- Keep the build green.

## Reporting issues

Use the GitHub issue templates. For safety-related bugs (e.g. an unverified deal shown as verified), mark the issue clearly and it will be prioritised.
