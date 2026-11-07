# Birthday Website — Claude Code Starter Pack

This pack contains:
- `MASTER_PROMPT.md` — paste this into Claude Code from the root of your project.
- `design_reference_01.png` and `design_reference_02.png` — visual direction boards for palette, mood, scenes, and asset ideas.

## How to use
1. Extract this ZIP.
2. Copy the two PNG reference images into your project, for example `docs/design-references/`.
3. Open the project root in your terminal and start Claude Code.
4. Paste the complete contents of `MASTER_PROMPT.md`.
5. Tell Claude Code: “The two images in docs/design-references are visual references. Study them before implementing. Do not use the entire boards as website backgrounds.”
6. Let Claude inspect the repo and implement the experience.

## Important
The PNGs are reference boards, not individual transparent production assets. They contain multiple illustrations and UI ideas in one image. Ask Claude to create clean SVG/CSS placeholders or crop only clean individual illustrations; replace them later with properly licensed or personally supplied artwork.

## Personalization after implementation
Edit the birthday config file Claude creates. Replace:
- recipient and sender names
- letter and final message
- `/public/assets/music/birthday-song.mp3`
- gallery images under `/public/assets/gallery/`

Do not expect browser audio to autoplay before a user interaction. The opening button should initiate playback.
