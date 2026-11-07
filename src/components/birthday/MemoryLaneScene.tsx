"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { birthday } from "@/config/birthday";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Cat } from "./art/Cat";
import { Tape, Petal } from "./art/Decor";

const TILTS = [-2.6, 1.8, -1.2, 2.4, -1.9];

/**
 * Scene G — the scrapbook.
 * Real photos if you add them, otherwise a pretty placeholder frame that says
 * exactly what to do. Either way the lightbox is fully keyboard-driven.
 */
export function MemoryLaneScene({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion();
  const photos = birthday.galleryPhotos;
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    lastFocused.current?.focus();
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpen((i) => {
        if (i === null) return i;
        const next = (i + dir + photos.length) % photos.length;
        return next;
      });
    },
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <div className="relative mx-auto w-full max-w-5xl px-5 pb-10 pt-4">
      <header className="text-center">
        <p className="tiny-caps">chapter six · Your little museum</p>
        <h1 className="mx-auto mt-3 max-w-[24ch] text-[1.6rem] leading-snug sm:text-[2.1rem]">
          Izzah's Gallery.
        </h1>
        <p className="mx-auto mt-3 max-w-[40ch] text-sm text-[var(--ink-soft)]">
          The only pics of Izzah that Izzah sent (You should send more :p).
        </p>
      </header>

      <ul className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {photos.map((photo, i) => {
          const tilt = TILTS[i % TILTS.length];
          return (
            <li key={i} className="relative">
              <motion.button
                type="button"
                onClick={(e) => {
                  lastFocused.current = e.currentTarget;
                  setOpen(i);
                }}
                whileHover={reduced ? undefined : { y: -4, rotate: 0 }}
                whileTap={{ scale: 0.98 }}
                className="group block w-full cursor-pointer text-left"
                style={{ rotate: `${reduced ? 0 : tilt}deg` }}
                aria-label={`Open photo ${i + 1}: ${photo.caption}`}
              >
                <div
                  className="relative bg-white p-2.5 pb-9 shadow-[0_16px_30px_-22px_rgba(118,91,88,0.9)] transition-shadow group-hover:shadow-[0_22px_38px_-24px_rgba(118,91,88,0.9)]"
                  style={{ borderRadius: 3 }}
                >
                  <Tape
                    className="absolute -top-2 left-1/2 z-10 -translate-x-1/2"
                    width={54}
                  />
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f4ece0]">
                    {photo.src ? (
                      <Image
                        src={photo.src}
                        alt={photo.caption}
                        fill
                        sizes="(max-width: 640px) 45vw, 30vw"
                        className="object-cover"
                      />
                    ) : (
                      <PlaceholderFrame index={i} />
                    )}
                  </div>
                  <p className="mt-2.5 line-clamp-2 font-hand text-[1.05rem] leading-tight text-[var(--ink)]">
                    {photo.caption}
                  </p>
                  {photo.note ? (
                    <p className="mt-0.5 truncate text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                      {photo.note}
                    </p>
                  ) : null}
                </div>
              </motion.button>
            </li>
          );
        })}

        <li className="col-span-2 flex items-end justify-center sm:col-span-1">
          <Cat
            cast="sleepy"
            width={110}
            float
            alt="A cat napping on the scrapbook"
          />
        </li>
      </ul>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Petal size={14} color="#c8dfe9" className="opacity-70" />
        <button type="button" onClick={onContinue} className="btn btn-primary px-8">
          One last page
          <span aria-hidden>→</span>
        </button>
      </div>

      <AnimatePresence>
        {current ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${(open ?? 0) + 1} of ${photos.length}: ${current.caption}`}
          >
            <button
              type="button"
              aria-label="Close photo"
              onClick={close}
              className="absolute inset-0 h-full w-full cursor-zoom-out bg-[rgba(88,68,64,0.55)] backdrop-blur-[2px]"
            />
            <motion.div
              key={open}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: reduced ? 0.14 : 0.28 }}
              className="relative w-full max-w-lg"
            >
              <div className="bg-white p-3 pb-14 shadow-2xl" style={{ borderRadius: 4 }}>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f4ece0]">
                  {current.src ? (
                    <Image
                      src={current.src}
                      alt={current.caption}
                      fill
                      sizes="(max-width: 768px) 90vw, 32rem"
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <PlaceholderFrame index={open ?? 0} large />
                  )}
                </div>
                <div className="absolute inset-x-5 bottom-3.5">
                  <p className="font-hand text-xl leading-tight text-[var(--ink)]">
                    {current.caption}
                  </p>
                  {current.note ? (
                    <p className="text-[0.66rem] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                      {current.note}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="btn text-sm"
                  aria-label="Previous photo"
                >
                  <span aria-hidden>←</span> Back
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  className="btn btn-quiet text-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="btn text-sm"
                  aria-label="Next photo"
                >
                  Next <span aria-hidden>→</span>
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-white/75">
                {(open ?? 0) + 1} / {photos.length} · Esc to close
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PlaceholderFrame({ index, large }: { index: number; large?: boolean }) {
  const tints = ["#f8dce5", "#f6e9a9", "#c8dfe9", "#b9cbaa", "#f4dcCf"];
  const tint = tints[index % tints.length];
  return (
    <div
      className="grid h-full w-full place-items-center"
      style={{
        background: `repeating-linear-gradient(135deg, ${tint} 0 10px, #fffaf2 10px 20px)`,
      }}
    >
      <div className="text-center px-3">
        <svg
          viewBox="0 0 48 48"
          width={large ? 46 : 30}
          height={large ? 46 : 30}
          aria-hidden
          className="mx-auto text-[var(--ink-soft)]"
        >
          <rect
            x={5}
            y={9}
            width={38}
            height={30}
            rx={4}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          />
          <circle cx={17} cy={19} r={3.4} fill="currentColor" opacity={0.6} />
          <path
            d="M8 34 L19 24 L27 31 L33 26 L40 33"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p
          className={`mt-1.5 font-semibold text-[var(--ink-soft)] ${large ? "text-sm" : "text-[0.66rem] leading-tight"}`}
        >
          {large ? "Add a photo here" : "your photo"}
        </p>
        {large ? (
          <p className="mx-auto mt-1 max-w-[26ch] text-xs text-[var(--ink-soft)]/85">
            Drop a file into <code>public/assets/gallery/</code> and point the
            config at it.
          </p>
        ) : null}
      </div>
    </div>
  );
}
