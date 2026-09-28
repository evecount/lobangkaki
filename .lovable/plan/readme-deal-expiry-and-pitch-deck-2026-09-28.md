# README, Deal Expiry, and Pitch Deck

## Build
- Replace the starter repository README with the complete supplied KampungLobang README, without altering its content.
- Add a judge-friendly `/readme` page that renders the complete README with readable headings, tables, lists, diagrams, and code blocks.
- Add navigation from the main experience to the README and pitch deck.
- Give every submitted meal deal a clear collection deadline, live countdown, and expired state.
- Automatically expire uncollected deals, stop any active speech, and replace their senior-facing verified message with an expiry warning so they cannot remain in voice broadcasts.
- Add a `/pitch` presentation page with hackathon slides, large accessible type, previous/next chevrons, keyboard controls, sliding transitions, progress, and a direct return to the live demo.

## Pitch Story
1. KampungLobang: Dignity by Design
2. The exclusion problem
3. One familiar resident experience
4. The Dignity Handshake trust model
5. Phantom-deal protection and automatic expiry
6. Alignment with Hack for Humanity
7. Architecture and $0 open-web stack
8. Demo invitation and honest limitations

## Technical Details
- Keep all state client-side and temporary, matching the project’s no-backend constraint.
- Use a fixed short demo expiry window so judges can observe countdown and removal during a live presentation.
- Keep slide position in the URL, with semantic app color tokens and reduced-motion support.
- Add unique metadata for the README and pitch routes.
- Verify the expiry path, README completeness, chevron/keyboard navigation, and phone/desktop layouts in the running app.
