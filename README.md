# A little surprise for you

An interactive birthday gift: eight scenes, one after another, built to feel
like opening a hand-folded card rather than scrolling a website.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · no other
runtime dependencies.

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

---

## Personalise it

**Everything you'd want to change lives in one file:**
`src/config/birthday.ts`

```ts
recipientName: "Izzah",
senderName:    "Rafie",
musicTitle:    "Little Daylight",
musicArtist:   "for Izzah",
```

Also in that file: `openingMessage`, `openingSubline`, `gardenMessage`,
`wishMessage`, `bouquetMessage`, `letterText` (newlines become paragraphs),
`finalMessage`, `galleryPhotos`, `flowerChoices`, and the cat cast.

### Replace the song

Overwrite `public/assets/music/birthday-song.mp3`. That's it. If you'd rather
keep your file elsewhere, point `musicSrc` at it. If the file is missing the
player shows a friendly note instead of breaking — try deleting it to see.

### Add photos

1. Drop images into `public/assets/gallery/`
2. List them in `galleryPhotos`:

```ts
galleryPhotos: [
  { src: "/assets/gallery/day-one.jpg", caption: "the very first day", note: "look how young we look" },
  { src: "",                            caption: "still to come",       note: "leave src empty for a placeholder" },
],
```

### Change the cats

Swap any WebP in `public/assets/characters/` and update its entry in
`theme.cast` (keep the real pixel `width`/`height` so the layout doesn't jump).
See `public/assets/README.md` for the full manifest.

### Tune the behaviour

```ts
theme: {
  confetti: true,              // false = no confetti anywhere
  restartMusicOnReplay: true,  // false = song keeps playing on Replay
}
```

---

## The eight scenes

| #   | Scene       | What happens                                                                             |
| --- | ----------- | ---------------------------------------------------------------------------------------- |
| 1   | Opening     | Sealed envelope; the flap swings open, then the page turns. Nothing plays until you tap. |
| 2   | Music       | Compact player: play/pause, scrubbable progress, volume (remembered).                    |
| 3   | Garden      | Tap flowers to bloom them, balloons to pop them, cats to hear what they think.           |
| 4   | Candles     | Hold the button, or opt into the microphone. Cameras off by default.                     |
| 5   | Bouquet     | Pick stems with per-flower limits, take them back out, then give it.                     |
| 6   | Letter      | Break the seal; the text types out. "Skip to the end" is always there.                   |
| 7   | Memory lane | Polaroids; lightbox with arrow keys and Escape.                                          |
| 8   | Final       | Closing line, one confetti burst, Replay.                                                |

---

## How it's put together

```
src/
  app/            layout.tsx, page.tsx, globals.css   (tokens + paper grain)
  config/         birthday.ts                          ← the only file to edit
  components/birthday/
    BirthdayExperience.tsx   scene index, chrome, replay
    scenes.ts                the ordered list of scenes
    SceneTransition.tsx      page-turn
    ProgressIndicator.tsx    stitched dot ribbon
    OpeningScene … FinalScene
    MusicPlayer.tsx          full player + persistent mini player
    BlowDetector.tsx         the microphone half of scene 4
    art/Cat.tsx              every cat, one component
    art/Flower.tsx art/Decor.tsx   all SVG illustration
  hooks/          useBlowDetection.ts, useReducedMotion.ts
  lib/            audio.ts (single AudioController), confetti.ts
```

### Decisions worth knowing

**Scene index, not routes.** `BirthdayExperience` holds one `index` number.
Back/Continue, the ribbon, and Replay all just move it. There is no router
state to get out of sync, and "Replay" is a reset to zero.

**One audio element, created lazily.** `lib/audio.ts` wraps a single
`HTMLAudioElement` (kept in memory, not in the DOM) with a subscribe/publish
API. Two components read it — the full player and the mini player — so there's
no chance of two songs playing at once. Volume is stored in `localStorage`
and failures to read/write it are swallowed (private-browsing safe). A load
error sets a `missing` status rather than throwing.

**Blow detection is deliberately conservative.** It only asks for the
microphone when you press "Use microphone". It then measures the room for
~650 ms and sets its threshold _above_ the ambient level, with a floor, so a
fan or a conversation can't blow out the candles. A breath must also be
_sustained_ (~0.7 s) before it counts. Tracks are stopped on success, cancel,
and unmount. If anything is denied or unsupported, the button path is
unaffected and the copy says so.

**Reduced motion is honoured throughout**, not just cosmetically: idle floats
and sway stop, confetti doesn't fire, the typewriter reveals instantly, and
transitions collapse to a crossfade.

**No image ever 404s.** Every decorative element — cake, envelope, balloons,
bunting, clouds, ribbons, tape, all five flowers — is an SVG component. The
only raster assets are the ten cat stickers, which are RGBA WebP at their
intrinsic size so there's no layout shift.

**Accessibility.** Semantic buttons, visible focus rings, `aria-current` on the
progress dots, `aria-live` around scene changes and the mic state, focus moved
to the top of each new scene, dialogs that trap Escape/arrows and restore focus
on close. The garden's touch targets are full elements, not hover states.

### Dependencies

- `motion` — scene transitions, spring pops in the bouquet, idle float. The
  spec asked for it by name.
- `tailwindcss` / `@tailwindcss/postcss` — utilities and the `@theme` palette.
- Nothing else at runtime. Confetti and audio are hand-rolled (`lib/`), roughly
  120 lines total, instead of pulling in canvas-confetti and Howler.

`playwright` is a devDependency used only for the manual verification runs in
this repo's history; it is not part of the app.

---

## Verification performed

Driven with Playwright against a production build, at 1280×900 and 375×812:

- Opening CTA → music scene; envelope animation completes.
- Audio: loads (41 s), progress advances, seek works, volume changes, pause
  freezes the clock, survives a scene change, mini player pauses.
- All 10 flowers bloom, 3 balloons pop and disappear, cats talk.
- Hold-to-blow extinguishes the candles and reveals "Make a wish!" — mouse and
  touch/keyboard.
- Mic: no false "listening" claim before permission; denial and unsupported
  both degrade to the button; fallback still works afterwards.
- Bouquet: CTA disabled at zero stems, enabled after picking, confirmation copy
  renders.
- Letter: skip enabled, Continue unlocks after skipping.
- Lightbox: opens, ArrowRight advances, Escape closes, focus restored.
- Replay returns to the envelope.
- Zero horizontal overflow at 375 px in every scene; zero console errors,
  page errors or failed requests across the whole flow.
- `prefers-reduced-motion`: no keyframe animations running.
- `npm run lint` and `npm run build` both pass.
