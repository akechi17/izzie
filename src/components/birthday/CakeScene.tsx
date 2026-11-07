"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { birthday } from "@/config/birthday";
import { burstConfetti } from "@/lib/confetti";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Cake, Sparkle, Petal } from "./art/Decor";
import { Cat } from "./art/Cat";
import { BlowDetector } from "./BlowDetector";

const HOLD_MS = 1400;

/** How long to wait after the mic opens before offering the button again. */
const FALLBACK_DELAY_MS = 6000;

/**
 * Scene D — the wish.
 *
 * Blowing out candles is the whole point, so a real breath comes first: the
 * microphone is offered as the primary route and starts listening on the
 * visitor's gesture. Holding the button is the fallback — always there, never
 * in the way — and it comes forward on its own if the mic is refused, the
 * browser has no microphone, or nothing happens for a few seconds.
 */
export function CakeScene({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdStart = useRef(0);
  const holding = useRef(false);
  const raf = useRef(0);
  const doneRef = useRef(false);

  const extinguish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setOut(true);
    burstConfetti(undefined, { count: 40, spread: 1.15, duration: 1900 });
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // Once the mic is listening, give it a fair go before offering the button —
  // but never leave anyone stuck if it can't hear them.
  useEffect(() => {
    if (!micOpen) return;
    const t = window.setTimeout(() => setShowFallback(true), FALLBACK_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [micOpen]);

  const onMicBlow = useCallback(() => {
    extinguish();
    setMicOpen(false);
  }, [extinguish]);

  const startHold = useCallback(() => {
    // Guard so a pointerdown followed by a keydown (or key repeat) can only
    // ever run one loop — otherwise progress keeps restarting at zero.
    if (doneRef.current || holding.current) return;
    holding.current = true;
    holdStart.current = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - holdStart.current) / HOLD_MS);
      setHoldProgress(p);
      if (p >= 1) {
        holding.current = false;
        extinguish();
        setHoldProgress(0);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [extinguish]);

  const endHold = useCallback(() => {
    holding.current = false;
    cancelAnimationFrame(raf.current);
    if (!doneRef.current) setHoldProgress(0);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl px-5 pb-8 pt-4">
      <header className="text-center">
        <p className="tiny-caps">chapter three · the candles</p>
        <h1 className="mx-auto mt-3 max-w-[26ch] text-[1.6rem] leading-snug sm:text-[2.1rem]">
          {out ? "Make a wish!" : birthday.wishMessage}
        </h1>
        <p className="mx-auto mt-3 max-w-[36ch] text-sm text-[var(--ink-soft)]">
          {out
            ? "Hold it gently. There's no need to tell anyone what it was."
            : "Lean in and blow, like the cake is really there."}
        </p>
      </header>

      <div className="relative mx-auto mt-6 flex max-w-md items-end justify-center">
        <Sparkle
          size={18}
          className="absolute left-2 top-4 opacity-80"
          color="#f6e9a9"
        />

        <motion.div
          animate={
            out
              ? reduced
                ? { opacity: 0.98 }
                : { opacity: 0.98, y: -2 }
              : reduced
                ? {}
                : { y: [0, -3, 0] }
          }
          transition={{ duration: 4, repeat: out ? 0 : Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <Cake candlesOut={out} className="h-auto w-[15rem] sm:w-[18rem]" />

          {/* smoke wisps */}
          <AnimatePresence>
            {out &&
              [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute rounded-full"
                  style={{
                    left: `calc(50% + ${(i - 1) * 34}px)`,
                    top: "12%",
                    width: 8,
                    height: 8,
                    background: "rgba(201,190,180,0.9)",
                    filter: "blur(2px)",
                  }}
                  initial={{ opacity: 0.85, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -58, scale: 2.4, x: (i - 1) * 8 }}
                  transition={{ duration: 1.9, delay: i * 0.16, ease: "easeOut" }}
                />
              ))}
          </AnimatePresence>
        </motion.div>

        <Cat
          cast="party"
          width={74}
          className="absolute -right-2 bottom-2 sm:-right-8"
          sway={2}
          alt="A cat in a party hat watching the candles"
        />
      </div>

      <div className="mx-auto mt-7 max-w-md">
        {out ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="font-hand text-2xl text-[var(--pink-deep)]">
              wish made ♡
            </p>
            <button type="button" onClick={onContinue} className="btn btn-primary px-8">
              Next, the flowers
              <span aria-hidden>→</span>
            </button>
          </motion.div>
        ) : (
          <>
            {micOpen ? (
              <BlowDetector
                onBlow={onMicBlow}
                onDismiss={() => setMicOpen(false)}
                onDenied={() => {
                  setMicDenied(true);
                  setShowFallback(true);
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setMicOpen(true)}
                className="btn btn-primary w-full"
                style={{ minHeight: 54 }}
              >
                <span aria-hidden>🎤</span>
                {micDenied ? "Try the microphone again" : "Blow out the candles"}
              </button>
            )}

            {!micOpen && !micDenied ? (
              <p className="mt-2 text-center text-xs text-[var(--ink-soft)]">
                Your browser will ask for the mic — it never leaves this page.
              </p>
            ) : null}

            <AnimatePresence>
              {showFallback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <button
                    type="button"
                    onPointerDown={startHold}
                    onPointerUp={endHold}
                    onPointerLeave={endHold}
                    onPointerCancel={endHold}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
                        e.preventDefault();
                        if (!e.repeat) startHold();
                      }
                    }}
                    onKeyUp={(e) => {
                      if (e.key === " " || e.key === "Enter") endHold();
                    }}
                    className="btn relative w-full overflow-hidden text-base"
                    aria-label="Hold to blow out the candles"
                    style={{ minHeight: 50 }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${holdProgress * 100}%`,
                        background: "rgba(246,233,169,0.85)",
                        transition: "width 60ms linear",
                      }}
                    />
                    <span className="relative">
                      {holdProgress > 0
                        ? "keep blowing…"
                        : micDenied
                          ? "or hold to blow"
                          : "No mic? Hold to blow"}
                    </span>
                  </button>
                  <p className="mt-2 text-center text-xs text-[var(--ink-soft)]">
                    press and hold for a second and a half
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <Petal
        size={14}
        color="#f8dce5"
        className="pointer-events-none absolute bottom-24 left-[10%] opacity-70"
      />
    </div>
  );
}
