# MASTER PROMPT — MOFUSAND-INSPIRED INTERACTIVE BIRTHDAY WEBSITE

You are a senior creative frontend engineer, interaction designer, and motion designer. Build a polished, responsive, emotionally warm interactive birthday website. The experience should feel like opening a lovingly handcrafted digital gift: cute, whimsical, tactile, and thoughtfully art-directed — not like a generic template or an AI-generated landing page.

## 0. FIRST: inspect the project
- Inspect the existing repository, package manager, framework, and conventions before changing anything.
- If the project is empty, scaffold a current stable Next.js App Router + TypeScript project.
- Preserve useful existing code. Do not overwrite unrelated files.
- Before implementation, briefly report the detected stack and your planned implementation in the terminal, then proceed.
- Do not stop after creating a plan. Implement the working experience.

## 1. CREATIVE DIRECTION
Theme: a Mofusand-inspired birthday world featuring adorable fluffy cats, including cats wearing shark hoodies, surrounded by flowers, ribbons, balloons, cake, gifts, and tiny decorative doodles.

Important asset guidance:
- The supplied reference images are ART DIRECTION / VISUAL REFERENCES, not finished website screenshots and not production-ready sprite sheets.
- Study their palette, character mood, composition, softness, and scene progression.
- Do not display the whole reference-board image as a page background.
- Do not copy garbled text or UI labels visible inside the references. Render all website text as real HTML.
- Prefer original, user-supplied, or properly licensed character artwork. If exact official Mofusand artwork is not supplied, create a cohesive Mofusand-inspired cat aesthetic rather than pretending generated art is official.
- Keep character designs consistent across scenes. Reuse the same small set of cat illustrations in different placements and sizes.
- If individual assets are unavailable, create tasteful CSS/SVG decorations and use clearly named image placeholders. Never leave broken image icons.

### Art direction
- Palette: soft pink `#F8DCE5`, warm cream `#FFF4E5`, butter yellow `#F6E9A9`, powder blue `#C8DFE9`, sage `#B9CBAA`, warm cocoa text `#765B58`.
- Use a warm off-white base, not pure white everywhere.
- Rounded but not excessively pill-shaped UI; subtle paper grain, scrapbook details, delicate borders, soft shadows, small hand-drawn accents.
- Typography: friendly rounded display font (e.g. Quicksand or Baloo 2) with a highly readable body font (e.g. Nunito). Use a handwritten accent sparingly (e.g. Caveat).
- Avoid neon gradients, glassmorphism, giant generic gradients, excessive blur, overuse of emoji, and repetitive card grids.
- Visual quality should be editorial and handcrafted. Establish a clear visual hierarchy and intentional negative space.
- Use responsive layouts designed for mobile first, then enhance for desktop.

## 2. EXPERIENCE FLOW
Build this as a guided sequence of scenes, not one long generic page. Each scene should feel like turning a page in a little birthday story. Provide a discreet progress indicator (dots, chapter labels, or a progress ribbon), Back / Continue controls where appropriate, and smooth transitions. Do not trap the user: allow going back and replaying.

### Scene A — Opening surprise
- Full-screen envelope / gift opening composition.
- Main copy: “Someone has a little surprise for you…”
- CTA: “Open Your Surprise”.
- On click, animate the envelope flap and reveal the music player.
- Do not autoplay audio before a user gesture.

### Scene B — Music player
- Show a cute compact player with placeholder title, artist, play/pause, progress bar, and volume control if practical.
- Use a replaceable placeholder file at `/public/assets/music/birthday-song.mp3`.
- Keep all music metadata and source in one config file.
- Use a robust audio element or Howler.js. Handle missing audio gracefully: show a helpful placeholder state, not a console-breaking error.
- Music should continue between scenes unless the user pauses it.
- Include a persistent small player control after the music has started.

### Scene C — Birthday garden
- A welcoming birthday garden with a “Happy Birthday, [Name]!” headline.
- Layer flowers, leaves, clouds, bunting, balloons, sparkles, and cat stickers at varied depths.
- Add restrained ambient motion: slow floating, tiny sway, drifting petals.
- Clickable details: tap a flower to bloom, tap a balloon to float away, tap a cat to show a tiny speech bubble or reaction.
- Provide reduced-motion alternatives and avoid constant distracting movement.

### Scene D — Make a wish / blow the candles
- Display a beautiful birthday cake with lit candles.
- Main copy: “Before you make a wish, let’s blow the candles!”
- Preferred interaction: microphone mode. Ask for microphone permission only after the user explicitly taps “Use microphone”.
- Use Web Audio API to estimate input volume and detect a sustained blow (volume threshold + short duration). Calibrate conservatively and provide a visible listening state.
- Always provide a fallback “Hold to Blow” button. The fallback must work without microphone permission.
- When candles go out: extinguish flames, add a soft smoke wisp, trigger a short confetti burst, and reveal “Make a wish!”.
- Stop microphone tracks immediately after success, cancellation, or leaving the scene. Handle permission denial and unsupported browsers gracefully.
- Do not claim the microphone is listening until permission has been granted.

### Scene E — Flower bouquet
- Let the visitor choose flowers (e.g. tulips, daisies, roses, sunflowers, baby’s breath).
- Each tap adds one flower to a bouquet preview with a small pop animation.
- Include quantity limits or a clear “remove” interaction so the layout cannot become cluttered.
- CTA: “Give Your Bouquet”.
- On confirmation, show a finished bouquet with ribbon and a short affectionate message.
- If real flower artwork is not available, use coherent local SVG/CSS illustrations rather than unrelated stock icons.

### Scene F — Birthday letter
- Show a sealed envelope. Clicking it opens the envelope and reveals a letter.
- Animate the letter entering the scene, then reveal its text with a gentle typewriter effect (include a skip option).
- Use editable personalized copy from the config file.
- Example placeholder copy:
  “Happy Birthday, [Name]! I hope this year brings you gentle days, wonderful surprises, new adventures, and countless reasons to smile. You deserve so many lovely things. With lots of love, ♡”
- Include a small cat illustration or stamp near the signature.

### Scene G — Memory lane
- A scrapbook / Polaroid gallery with replaceable photo placeholders.
- Each photo has editable caption text.
- Clicking a photo opens an accessible lightbox; Escape closes it, and next/previous controls work.
- If no photos are supplied, show attractive placeholder frames with instructions in the README/config — never broken images.

### Scene H — Final surprise
- A celebratory final composition with cats, flowers, gift box, balloons, and a short confetti moment.
- Closing message: “Once again, Happy Birthday! I hope your world is always filled with little reasons to smile. ♡”
- CTA: “Replay the Surprise” resets the scene flow. Decide whether music should continue or reset, and make the behavior consistent.
- Add a small footer note such as “Made with love ♡”.

## 3. TECHNICAL REQUIREMENTS
- Preferred stack: Next.js App Router, TypeScript, Tailwind CSS, and Motion (Framer Motion package) for animation. Adapt if the repo already uses a sound alternative.
- Use semantic HTML, accessible buttons, keyboard navigation, focus states, and meaningful alt text.
- Respect `prefers-reduced-motion`.
- Ensure mobile touch interactions work; do not rely on hover.
- Avoid layout shifts. Reserve image dimensions/aspect ratios.
- Optimize images (use WebP/AVIF when appropriate) and lazy-load non-critical images.
- Keep components small and purposeful. Avoid one giant page component.
- Keep state transitions predictable. Use a simple finite-state / scene-index approach.
- Clean up event listeners, audio contexts, animation loops, and microphone tracks.
- No fake controls: every visible button must do something.
- No dead links, missing assets, or placeholder lorem ipsum.
- Do not introduce unnecessary dependencies. Explain any dependency you add.
- Ensure `npm run lint` and `npm run build` pass (or the repository's equivalent). Fix errors before finishing.

## 4. CONTENT CONFIGURATION
Create a single easy-to-edit file, for example `src/config/birthday.ts`, containing:
- recipientName
- senderName
- musicTitle
- musicArtist
- musicSrc
- openingMessage
- gardenMessage
- letterText
- finalMessage
- galleryPhotos (array of image path + caption)
- flowerChoices
- optional theme settings

The user should be able to personalize the experience by editing this file and replacing files in `public/assets/`, without hunting through components.

## 5. SUGGESTED PROJECT STRUCTURE
src/
  app/
    page.tsx
    globals.css
  components/
    birthday/
      BirthdayExperience.tsx
      SceneTransition.tsx
      OpeningScene.tsx
      MusicPlayer.tsx
      GardenScene.tsx
      CakeScene.tsx
      BlowDetector.tsx
      BouquetScene.tsx
      LetterScene.tsx
      MemoryLaneScene.tsx
      FinalScene.tsx
      ProgressIndicator.tsx
  config/
    birthday.ts
  hooks/
    useBlowDetection.ts
    useReducedMotion.ts
  lib/
    audio.ts
    confetti.ts
public/
  assets/
    characters/
    flowers/
    decorations/
    gallery/
    music/
  fonts/

You may adjust this structure if the existing repository has a better convention.

## 6. ART ASSET PLAN
Create an asset manifest in `public/assets/README.md` listing every expected file, recommended dimensions, transparency needs, and where it is used. Use descriptive filenames, for example:
- `cat-shark-hoodie.png`
- `cat-birthday-hat.png`
- `cat-holding-flowers.png`
- `cat-sleeping.png`
- `cake-with-candles.png`
- `flower-tulip.png`
- `flower-daisy.png`
- `flower-rose.png`
- `flower-sunflower.png`
- `flower-gerbera.png`
- `balloon-pink.png`
- `balloon-yellow.png`
- `bow-pink.png`
- `gift-box.png`
- `envelope.png`
- `sparkle.png`
- `petal.png`

If the reference boards are the only images available, do not use the entire board as an asset. You may crop individual illustrations only if the crop is clean and does not include labels, borders, or neighboring art. Prefer replacing low-quality crops with custom SVG/CSS placeholders and document which assets should later be replaced.

## 7. QUALITY BAR / ACCEPTANCE CHECKLIST
Before finishing, test the actual flow from opening to final scene:
- Opening CTA works.
- Audio can play and pause after user interaction; missing audio is handled.
- Back / Continue and progress navigation work.
- Garden click interactions work.
- Blow-to-extinguish works with both microphone and button fallback.
- Microphone permission denial does not block the experience.
- Bouquet selection and confirmation work.
- Letter opens and typewriter can be skipped.
- Gallery lightbox works with keyboard and touch.
- Replay resets the experience.
- Layout works at 375px mobile width and desktop width.
- Reduced-motion preference is respected.
- No broken assets, runtime errors, or dead controls.

## 8. IMPLEMENTATION WORKFLOW
1. Inspect repository and report the existing setup.
2. Build the full visual system and scene navigation.
3. Implement all scenes and interactions.
4. Add placeholder assets / SVG illustrations and a clear asset manifest.
5. Add personalization config and README instructions.
6. Run lint/build and fix issues.
7. Summarize files created, commands run, how to replace music/photos/artwork, and any remaining assets the user should provide.

Make the result feel like a thoughtful, handcrafted birthday gift. Prioritize visual coherence, charming details, real interactions, and a smooth experience over adding lots of unnecessary features.
