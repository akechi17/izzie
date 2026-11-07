"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { birthday } from "@/config/birthday";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { burstConfetti } from "@/lib/confetti";
import { Cat } from "./art/Cat";
import {
  Balloon,
  Blob,
  Bunting,
  GiftBox,
  Petal,
  Sparkle,
} from "./art/Decor";
import { Flower } from "./art/Flower";

/**
 * Scene H — the last page.
 * One short confetti moment on arrival, the closing line, and a way back to
 * the beginning. Music is deliberately left alone unless the config says
 * otherwise.
 */
export function FinalScene({
  onReplay,
  confettiEnabled,
}: {
  onReplay: () => void;
  confettiEnabled: boolean;
}) {
  const reduced = useReducedMotion();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (!confettiEnabled) return;
    const t = window.setTimeout(
      () => burstConfetti(undefined, { count: 64, spread: 1.25, duration: 2600 }),
      260,
    );
    return () => window.clearTimeout(t);
  }, [confettiEnabled]);

  return (
    <div className="relative mx-auto w-full max-w-3xl px-5 pb-10 pt-2">
      <Bunting className="mx-auto h-9 w-full max-w-xl opacity-90 sm:h-12" count={7} />

      <Blob
        color="#f8dce5"
        className="pointer-events-none absolute left-1/2 top-24 -z-10 w-[26rem] -translate-x-1/2 opacity-45 sm:w-[32rem]"
      />

      <header className="relative mt-4 text-center">
        <p className="tiny-caps">the last page</p>
        <h1 className="mx-auto mt-3 max-w-[20ch] text-[1.85rem] leading-tight sm:text-[2.6rem]">
          Once again,<br />
          <span className="text-[var(--pink-deep)]">Happy Birthday!</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[38ch] text-[0.98rem] text-[var(--ink-soft)]">
          I hope your world is always filled with little reasons to smile. ♡
        </p>
      </header>

      <div className="relative mt-8 grid grid-cols-3 items-end gap-2 sm:gap-6">
        <div className="flex justify-end">
          <Cat cast="party" width={96} sway={2} alt="A cat in a party hat" />
        </div>

        <div className="relative flex flex-col items-center">
          <GiftBox className="h-auto w-[7.5rem] sm:w-[9rem]" />
          <motion.div
            aria-hidden
            className="absolute -top-3 left-1/2 -translate-x-1/2"
            animate={reduced ? {} : { y: [0, -5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkle size={20} color="#f6e9a9" />
          </motion.div>
        </div>

        <div className="flex justify-start">
          <Cat cast="host" width={104} float alt="The birthday cat" />
        </div>
      </div>

      <div className="relative mt-2 flex items-end justify-center gap-1 opacity-90">
        <Flower shape="tulip" hue="#f2a9bd" stem size={40} />
        <Flower shape="daisy" hue="#fff7e6" stem size={34} />
        <Flower shape="rose" hue="#e98c8c" stem size={36} />
        <Flower shape="sunflower" hue="#f2c85b" stem size={38} />
        <Flower shape="tulip" hue="#d9b7e8" stem size={34} />
      </div>

      <Balloon
        color="#f8dce5"
        outline="#d89bb0"
        className="pointer-events-none absolute -left-2 top-16 hidden opacity-80 sm:block"
        style={{ width: 58, height: 94 }}
      />
      <Balloon
        color="#c8dfe9"
        outline="#93b6c6"
        className="pointer-events-none absolute right-0 top-24 hidden opacity-75 sm:block"
        style={{ width: 48, height: 78 }}
      />

      <div className="mt-8 flex flex-col items-center gap-3">
        <button type="button" onClick={onReplay} className="btn btn-primary px-8">
          Replay the Surprise
          <span aria-hidden>↺</span>
        </button>
        <p className="font-hand text-lg text-[var(--ink-soft)]">
          from the very first envelope
        </p>
      </div>

      <footer className="mt-10 flex flex-col items-center gap-2 border-t pt-5" style={{ borderColor: "rgba(118,91,88,0.13)" }}>
        <div className="flex items-center gap-1.5">
          <Cat cast="loaf" width={42} alt="" />
          <p className="text-xs tracking-[0.08em] text-[var(--ink-soft)]">
            Made for {birthday.recipientName} ♡
          </p>
          <Petal size={12} color="#f0b8c9" className="opacity-80" />
        </div>
      </footer>
    </div>
  );
}
