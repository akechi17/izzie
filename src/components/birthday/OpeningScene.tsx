"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { birthday } from "@/config/birthday";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Cat } from "./art/Cat";
import { EnvelopeArt, Sparkle, Petal, Cloud } from "./art/Decor";

/**
 * Scene A — the sealed envelope.
 * The whole interaction is one honest gesture: tap the envelope, it opens,
 * then the page turns to the song.
 */
export function OpeningScene({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const reduced = useReducedMotion();

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // Long enough to watch the flap fold back and the note rise; the reduced
    // -motion path skips the animation entirely.
    window.setTimeout(onOpen, reduced ? 120 : 1180);
  };

  return (
    <div className="relative flex min-h-[calc(100dvh-9rem)] flex-col items-center justify-center px-5 py-10">
      <Cloud className="pointer-events-none absolute left-[6%] top-6 w-24 opacity-70 sm:w-32" />
      <Cloud className="pointer-events-none absolute right-[8%] top-24 hidden w-20 opacity-55 sm:block" />

      <div className="relative flex w-full max-w-lg flex-col items-center text-center">
        <p className="tiny-caps">a small thing, made by hand</p>

        <h1 className="mt-5 max-w-[22ch] text-[1.72rem] leading-[1.25] sm:max-w-[24ch] sm:text-4xl">
          {birthday.openingMessage}
        </h1>

        <p className="mt-4 max-w-[34ch] text-[0.98rem] text-[var(--ink-soft)]">
          {birthday.openingSubline}
        </p>

        <div className="relative mt-9 w-full max-w-[22rem] sm:max-w-[26rem]">
          <motion.button
            type="button"
            onClick={handleOpen}
            aria-label={
              opening ? "Opening the envelope" : "Open your surprise"
            }
            className="group relative block w-full cursor-pointer rounded-3xl focus-visible:outline-offset-8"
            whileTap={reduced ? undefined : { scale: 0.975 }}
            animate={
              opening && !reduced
                ? { y: -14, rotate: -2, transition: { duration: 0.6 } }
                : {}
            }
          >
            <motion.div
              animate={
                reduced || opening
                  ? {}
                  : { y: [0, -5, 0] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <EnvelopeArt open={opening} className="h-auto w-full" />
            </motion.div>
          </motion.button>

          <Cat
            cast="shark"
            width={104}
            className="absolute -bottom-8 -right-2 sm:-right-6 sm:w-[118px]"
            style={{ width: undefined }}
            alt="A cat in a shark hoodie peeking over the envelope"
          />
          <Sparkle
            size={22}
            className="absolute -left-3 top-8 opacity-90"
            color="#f6e9a9"
          />
          <Petal
            size={16}
            color="#f0b8c9"
            className="absolute -top-2 right-10 opacity-80"
          />
        </div>

        <button
          type="button"
          onClick={handleOpen}
          disabled={opening}
          className="btn btn-primary mt-14 w-full max-w-xs text-base sm:w-auto"
        >
          {opening ? "Opening…" : "Open Your Surprise"}
        </button>

        <AnimatePresence>
          {opening && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 font-hand text-lg text-[var(--ink-soft)]"
              role="status"
            >
              here it comes…
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <Petal
        size={12}
        color="#c8dfe9"
        className="pointer-events-none absolute bottom-16 left-[14%] opacity-70"
      />
      <Petal
        size={14}
        color="#f6e9a9"
        className="pointer-events-none absolute bottom-24 right-[18%] opacity-70"
      />
    </div>
  );
}
