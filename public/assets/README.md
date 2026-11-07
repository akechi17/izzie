# Asset manifest

Everything here is already wired up. Replace a file and keep its name and the
site picks it up — no code changes needed. Every file is referenced from
`src/config/birthday.ts`.

## characters/

The recurring cat cast. These are the supplied sticker PNGs, converted to WebP
(≈75% smaller, same artwork). All are RGBA with transparent backgrounds.

| File | Size | Used in | Suggested content |
| --- | --- | --- | --- |
| `sticker-31.webp` | 224×245 | Garden host, final scene | A cat wearing a little hat |
| `sticker-52.webp` | 379×200 | Letter, memory lane | A long cosy cat asleep |
| `sticker-12.webp` | 162×211 | Opening envelope | A cat in a blue shark hoodie |
| `sticker-02.webp` | 160×239 | Cake scene, final scene | A cat in a party hat |
| `sticker-58.webp` | 200×196 | Bouquet preview | A cat hiding behind flowers |
| `sticker-46.webp` | 161×85 | Footer doodle | A cat loafing flat |
| `sticker-34.webp` | 144×135 | Garden, speech bubbles | A cat peeking over an edge |
| `sticker-26.webp` | 99×123 | Letter signature | A tiny cat doodle |
| `sticker-37.webp` | 128×128 | Music scene | A cat sitting up |
| `sticker-06.webp` | 166×233 | Garden | A cat wrapped in a blanket |

To swap one, drop the new file in and update the matching `theme.cast` entry
in the config (`src`, `width`, `height` — the intrinsic pixel size, so nothing
shifts while loading).

> **Note:** the semantic names in the config (`host`, `shark`, `party`, …) are
> descriptive guesses from silhouette and colour analysis. If a cat looks out of
> place, just point a different sticker at that role — it's a one-line change.

## music/

| File | Format | Notes |
| --- | --- | --- |
| `birthday-song.mp3` | MP3, 41 s, mono, ~39 kbps | **Placeholder.** A gentle music-box lullaby synthesised for this project, so the player works out of the box. Replace it with the real song, keeping the filename. |

Any format the browser can play works (`.mp3`, `.m4a`, `.ogg`); update
`musicSrc` in the config if you change the extension. Keep it under a few MB —
it loads on demand, not on first paint.

## gallery/

Empty on purpose. Drop photos here and list them in `galleryPhotos`:

```ts
{ src: "/assets/gallery/first-day.jpg", caption: "the very first day", note: "look how young we look" }
```

- Square-ish (**4:5 portrait**) crops look best; they're displayed with
  `object-fit: cover`.
- 1200×1500 px is plenty; roughly 200 KB each.
- Leave `src` empty (`""`) and the pretty placeholder frame is shown instead.
- Captions and notes are plain text on the Polaroid — no limit, but two short
  lines read best.

## Scene art that is *not* a file

Cake, envelope, balloons, bunting, clouds, sparkles, petals, gift box, ribbon,
tape and all five flower types are **SVG components**, not images:

- `src/components/birthday/art/Flower.tsx` — tulip, daisy, rose, sunflower,
  gerbera. One shared 100×110 head geometry so any mix stays level.
- `src/components/birthday/art/Decor.tsx` — everything else.

Replacing these with real artwork is optional. If you do, keep the component
names and swap the internals.

## Files the spec mentioned that are intentionally absent

`cat-shark-hoodie.png`, `cake-with-candles.png`, `flower-tulip.png`,
`balloon-pink.png`, `envelope.png`, etc. — there is no `public/assets/cake/`
or `flowers/` directory because those are all drawn as SVG. Nothing 404s.
