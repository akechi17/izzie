"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { birthday } from "@/config/birthday";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Cat } from "./art/Cat";
import { EnvelopeArt, Sparkle, Tape } from "./art/Decor";

const CHAR_DELAY = 18;

/**
 * Scene F — the letter.
 * Tap the seal, the flap swings open, the paper slides out and the words
 * arrive one at a time. Skipping is always one tap away.
 */
export function LetterScene({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [typed, setTyped] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const timer = useRef<number | null>(null);

  const text = birthday.letterText;
  const total = text.length;
  const complete = skipped || typed >= total;

  // Typewriter. Reduced-motion users get the whole letter at once.
  useEffect(() => {
    if (!opened || reduced || skipped) return;
    if (typed >= total) return;
    timer.current = window.setTimeout(() => {
      setTyped((t) => Math.min(total, t + 2));
    }, CHAR_DELAY);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [opened, reduced, skipped, typed, total]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const skip = () => {
    setSkipped(true);
    setTyped(total);
  };

  const paragraphs = useMemo(
    () => text.slice(0, skipped ? total : typed).split("\n"),
    [text, typed, skipped, total],
  );

  return (
    <div className="relative mx-auto w-full max-w-2xl px-5 pb-10 pt-4">
      <header className="text-center">
        <p className="tiny-caps">chapter five · the letter</p>
        <h1 className="mx-auto mt-3 max-w-[22ch] text-[1.6rem] leading-snug sm:text-[2rem]">
          {opened ? "Take your time with this one." : "I wrote something down."}
        </h1>
      </header>

      {!opened ? (
        <div className="relative mx-auto mt-10 flex max-w-md flex-col items-center">
          <motion.button
            type="button"
            onClick={() => setOpened(true)}
            aria-label="Open the letter"
            className="relative cursor-pointer"
            whileHover={reduced ? undefined : { y: -4 }}
            whileTap={{ scale: 0.98 }}
            animate={reduced ? {} : { y: [0, -5, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <EnvelopeArt className="h-auto w-full max-w-[22rem]" />
          </motion.button>
          <Cat
            cast="sleepy"
            width={128}
            className="mt-2"
            alt="A cat dozing beside the sealed envelope"
          />
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="btn btn-primary mt-6 px-8"
          >
            Break the seal
          </button>
          <p className="mt-3 font-hand text-lg text-[var(--ink-soft)]">
            (the cat has already read it)
          </p>
        </div>
      ) : (
        <div className="relative mx-auto mt-8 max-w-xl">
          <motion.article
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -0.5 }}
            transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.2, 0.9, 0.25, 1] }}
            className="paper-card relative px-6 pb-8 pt-9 sm:px-10"
            style={{ background: "#fffaf2" }}
          >
            <Tape className="absolute -top-2 left-1/2 -translate-x-1/2" width={86} />
            <Sparkle size={16} className="absolute right-5 top-5" color="#f6e9a9" />

            <p className="font-hand text-xl text-[var(--ink-soft)]">
              dear {birthday.recipientName},
            </p>

            <div
              className="mt-3 min-h-[14rem] text-[0.98rem] leading-[1.85]"
              aria-live="off"
            >
              {paragraphs.map((line, i) =>
                line.trim() === "" ? (
                  <div key={i} className="h-3.5" />
                ) : (
                  <p key={i} className="whitespace-pre-wrap">
                    {line}
                  </p>
                ),
              )}
              {!complete ? (
                <span
                  aria-hidden
                  className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] bg-[var(--ink-soft)]"
                  style={{ animation: "caret 1s steps(1) infinite" }}
                />
              ) : null}
            </div>

            <div className="mt-6 flex items-end justify-between gap-4 border-t pt-5" style={{ borderColor: "rgba(118,91,88,0.13)" }}>
              <div>
                <p className="font-hand text-xl text-[var(--pink-deep)]">
                  from,
                </p>
                <p className="font-hand text-2xl">{birthday.senderName}</p>
              </div>
              <div className="relative flex items-end gap-1">
                <Cat cast="tiny" width={52} alt="" />
                <div
                  aria-hidden
                  className="mb-1 grid h-12 w-12 place-items-center rounded-full border-2 border-dashed"
                  style={{
                    borderColor: "rgba(201,139,160,0.6)",
                    color: "rgba(201,139,160,0.85)",
                    transform: "rotate(-8deg)",
                    fontFamily: "var(--font-hand), cursive",
                    fontSize: "0.62rem",
                    lineHeight: 1.05,
                    textAlign: "center",
                    padding: 3,
                  }}
                >
                  with
                  <br />
                  love
                </div>
              </div>
            </div>

            {!complete ? (
              <button
                type="button"
                onClick={skip}
                className="mt-5 text-sm font-semibold underline decoration-2 underline-offset-4"
                style={{
                  color: "var(--ink-soft)",
                  textDecorationColor: "var(--pink-deep)",
                }}
              >
                Skip to the end
              </button>
            ) : null}
          </motion.article>

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={onContinue}
              className="btn btn-primary px-8"
              disabled={!complete}
            >
              Your little museum
              <span aria-hidden>→</span>
            </button>
          </div>
          {!complete ? (
            <p className="mt-2 text-center text-xs text-[var(--ink-soft)]">
              or skip the handwriting above
            </p>
          ) : null}
        </div>
      )}

      <style jsx>{`
        @keyframes caret {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
