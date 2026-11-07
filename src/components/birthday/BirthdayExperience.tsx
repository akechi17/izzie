"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { birthday } from "@/config/birthday";
import { getAudio } from "@/lib/audio";
import { SCENES, SCENE_COUNT, type SceneKey } from "./scenes";
import { OpeningScene } from "./OpeningScene";
import { MusicPlayer, MiniPlayer } from "./MusicPlayer";
import { GardenScene } from "./GardenScene";
import { CakeScene } from "./CakeScene";
import { BouquetScene } from "./BouquetScene";
import { LetterScene } from "./LetterScene";
import { MemoryLaneScene } from "./MemoryLaneScene";
import { FinalScene } from "./FinalScene";
import { ProgressIndicator } from "./ProgressIndicator";
import { SceneTransition } from "./SceneTransition";

const CHROME_HIDDEN: SceneKey[] = ["opening"];

/**
 * The whole experience is a scene index — nothing more complicated than that.
 * `index` is the current page; `furthest` remembers how far back the visitor
 * may jump so the progress ribbon never spoils what's ahead.
 */
export function BirthdayExperience() {
  const [index, setIndex] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const scene = SCENES[index].key;
  const headingRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(SCENE_COUNT - 1, next));
      if (clamped === index) return;
      setDirection(clamped > index ? 1 : -1);
      setIndex(clamped);
      setFurthest((f) => Math.max(f, clamped));
    },
    [index],
  );

  const replay = useCallback(() => {
    const audio = getAudio();
    if (audio && birthday.theme.restartMusicOnReplay) audio.restart();
    setDirection(-1);
    setIndex(0);
    setFurthest(0);
  }, []);

  // Move focus to the top of the new scene so keyboard & screen-reader users
  // aren't left on a button that no longer exists.
  useEffect(() => {
    if (index === 0) return;
    const el = headingRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index]);

  const chromeHidden = CHROME_HIDDEN.includes(scene);

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Masthead — quiet, and absent on the opening so nothing competes with it. */}
      <AnimatePresence initial={false}>
        {!chromeHidden && (
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32 }}
            className="sticky top-0 z-40 px-4 pt-3"
          >
            <div
              className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border px-3.5 py-2"
              style={{
                borderColor: "rgba(118,91,88,0.12)",
                background: "rgba(253,247,239,0.86)",
                backdropFilter: "blur(8px)",
              }}
            >
              <button
                type="button"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm font-semibold text-[var(--ink-soft)] disabled:opacity-35"
              >
                <span aria-hidden>←</span>
                <span className="hidden sm:inline">Back</span>
                <span className="sr-only">to the previous page</span>
              </button>

              <ProgressIndicator index={index} onJump={go} unlockedUpTo={furthest} />

              <div className="flex items-center gap-2">
                <MiniPlayer />
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  disabled={index === SCENE_COUNT - 1}
                  className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm font-semibold text-[var(--ink-soft)] disabled:opacity-35"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span aria-hidden>→</span>
                  <span className="sr-only">to the next page</span>
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div
        ref={headingRef}
        tabIndex={-1}
        className="flex-1 outline-none"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <SceneTransition id={scene} key={scene}>
            {scene === "opening" ? <OpeningScene onOpen={() => go(1)} /> : null}
            {scene === "music" ? (
              <div className="mx-auto w-full max-w-3xl px-5 pb-10 pt-8">
                <div className="mb-7 text-center">
                  <p className="tiny-caps">chapter one · the song</p>
                  <h1 className="mx-auto mt-3 max-w-[22ch] text-[1.6rem] leading-snug sm:text-[2rem]">
                    It comes with a soundtrack.
                  </h1>
                </div>
                <MusicPlayer onContinue={() => go(2)} />
              </div>
            ) : null}
            {scene === "garden" ? <GardenScene onContinue={() => go(3)} /> : null}
            {scene === "wish" ? <CakeScene onContinue={() => go(4)} /> : null}
            {scene === "bouquet" ? <BouquetScene onContinue={() => go(5)} /> : null}
            {scene === "letter" ? <LetterScene onContinue={() => go(6)} /> : null}
            {scene === "memories" ? (
              <MemoryLaneScene onContinue={() => go(7)} />
            ) : null}
            {scene === "final" ? (
              <FinalScene
                onReplay={replay}
                confettiEnabled={birthday.theme.confetti}
              />
            ) : null}
          </SceneTransition>
        </AnimatePresence>
      </div>

      {/* Paper margin doodle at the very bottom of long scenes. */}
      <div
        aria-hidden
        className="pointer-events-none h-6 w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(118,91,88,0.09) 0 2px, transparent 2px 14px)",
          maskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
        }}
      />
    </div>
  );
}
