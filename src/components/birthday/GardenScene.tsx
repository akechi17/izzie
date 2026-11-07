"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { birthday } from "@/config/birthday";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Cat } from "./art/Cat";
import {
  Balloon,
  Bunting,
  Cloud,
  Petal,
  Sparkle,
} from "./art/Decor";
import { Flower, type FlowerShape } from "./art/Flower";
import { burstConfetti } from "@/lib/confetti";

type Bloom = {
  id: number;
  shape: FlowerShape;
  hue: string;
  left: number;
  bottom: number;
  size: number;
  tilt: number;
};

const GARDEN_FLOWERS: Omit<Bloom, "id">[] = [
  { shape: "tulip", hue: "#f2a9bd", left: 4, bottom: 6, size: 58, tilt: -6 },
  { shape: "daisy", hue: "#fff7e6", left: 15, bottom: 2, size: 46, tilt: 4 },
  { shape: "rose", hue: "#e98c8c", left: 26, bottom: 9, size: 40, tilt: -3 },
  { shape: "sunflower", hue: "#f2c85b", left: 37, bottom: 1, size: 54, tilt: 5 },
  { shape: "gerbera", hue: "#f2915c", left: 48, bottom: 7, size: 42, tilt: -4 },
  { shape: "tulip", hue: "#d9b7e8", left: 58, bottom: 2, size: 46, tilt: 7 },
  { shape: "daisy", hue: "#fff7e6", left: 69, bottom: 8, size: 52, tilt: -5 },
  { shape: "rose", hue: "#f2a9bd", left: 79, bottom: 1, size: 44, tilt: 3 },
  { shape: "sunflower", hue: "#f6d98a", left: 88, bottom: 6, size: 50, tilt: -6 },
  { shape: "gerbera", hue: "#f2a9bd", left: 95, bottom: 2, size: 40, tilt: 5 },
];

const CAT_REACTIONS = [
  "oh! you found me.",
  "the flowers say hi too.",
  "i've been sitting here all morning.",
  "careful, the balloon is shy.",
  "birthday cats are the softest cats.",
  "psst — there's cake later.",
];

/**
 * Scene C — the garden.
 * Everything is tappable: flowers bloom open, balloons drift off the page,
 * and each cat has one small thing to say.
 */
export function GardenScene({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion();
  const [blooms, setBlooms] = useState<Bloom[]>(() =>
    GARDEN_FLOWERS.map((f, i) => ({ ...f, id: i })),
  );
  const [goneBalloons, setGoneBalloons] = useState<number[]>([]);
  const [speech, setSpeech] = useState<{ id: string; text: string } | null>(null);
  const [bloomedCount, setBloomedCount] = useState(0);

  const balloons = useMemo(
    () => [
      { id: 0, color: "#f8dce5", outline: "#d89bb0", x: "6%", y: "12%", size: 70 },
      { id: 1, color: "#f6e9a9", outline: "#d9c473", x: "84%", y: "8%", size: 58 },
      { id: 2, color: "#c8dfe9", outline: "#93b6c6", x: "72%", y: "30%", size: 44 },
    ],
    [],
  );

  const bloom = (b: Bloom) => {
    setBlooms((list) =>
      list.map((item) =>
        item.id === b.id
          ? { ...item, size: Math.min(item.size + 10, 92), tilt: item.tilt + 6 }
          : item,
      ),
    );
    setBloomedCount((c) => c + 1);
  };

  const popBalloon = (id: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    burstConfetti(
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      { count: 14, spread: 0.9, duration: 1100 },
    );
    setGoneBalloons((g) => [...g, id]);
  };

  const say = (id: string) => {
    const text =
      speech?.id === id
        ? speech.text
        : CAT_REACTIONS[Math.floor(Math.random() * CAT_REACTIONS.length)];
    setSpeech({ id, text });
    window.setTimeout(() => {
      setSpeech((s) => (s && s.id === id ? null : s));
    }, 4200);
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl px-5 pb-8 pt-4">
      <Bunting className="mb-2 h-10 w-full opacity-90 sm:h-14" count={9} />

      <header className="relative z-10 mx-auto max-w-xl text-center">
        <p className="tiny-caps">chapter two · the garden</p>
        <h1 className="mt-3 text-[2rem] leading-tight sm:text-5xl">
          Happy Birthday,{" "}
          <span className="relative inline-block">
            {birthday.recipientName}!
            <svg
              aria-hidden
              viewBox="0 0 120 12"
              className="absolute -bottom-1.5 left-0 h-2.5 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M2 8 C28 2 54 10 80 5 C96 2 110 6 118 4"
                fill="none"
                stroke="#e2a9bd"
                strokeWidth={3}
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-[38ch] text-[var(--ink-soft)]">
          {birthday.gardenMessage}
        </p>
      </header>

      {/* The garden stage */}
      <div className="relative mt-8 min-h-[27rem] sm:min-h-[30rem]">{/* scenery */}
        <Cloud className="pointer-events-none absolute left-[2%] top-2 w-28 opacity-75 sm:w-36" />
        <Cloud className="pointer-events-none absolute right-[10%] top-12 w-20 opacity-55" />
        <Sparkle
          size={20}
          className="absolute left-[38%] top-6 opacity-80"
          color="#f6e9a9"
        />

        {/* balloon strings come out of the ground line */}
        {balloons.map((b) =>
          goneBalloons.includes(b.id) ? null : (
            <motion.button
              key={b.id}
              type="button"
              onClick={(e) => popBalloon(b.id, e.currentTarget)}
              aria-label="Let a balloon float away"
              className="absolute cursor-pointer"
              style={{ left: b.x, top: b.y }}
              animate={
                reduced
                  ? {}
                  : { y: [0, -10, 0], rotate: [-2, 2, -2] }
              }
              transition={{
                duration: 6 + b.id,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileTap={{ scale: 0.92 }}
            >
              <Balloon
                color={b.color}
                outline={b.outline}
                style={{ width: b.size, height: (b.size * 130) / 80 }}
              />
            </motion.button>
          ),
        )}

        {/* cats at varied depths */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%]">
          <div className="relative">
            <AnimatePresence>
              {speech && (
                <motion.p
                  key={speech.text + speech.id}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  className="absolute -top-2 left-1/2 z-20 w-max max-w-[13rem] -translate-x-1/2 -translate-y-full rounded-2xl border bg-[#fffaf2] px-3.5 py-2 text-center text-sm shadow-[0_10px_20px_-14px_rgba(118,91,88,0.7)]"
                  style={{ borderColor: "rgba(118,91,88,0.16)" }}
                  role="status"
                >
                  {speech.text}
                  <span
                    aria-hidden
                    className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r bg-[#fffaf2]"
                    style={{ borderColor: "rgba(118,91,88,0.16)" }}
                  />
                </motion.p>
              )}
            </AnimatePresence>
            <Cat
              cast="host"
              width={168}
              float
              alt="The birthday cat, wearing a little party hat"
              onClick={() => say("host")}
              label="Say hello to the birthday cat"
            />
          </div>
        </div>

        <Cat
          cast="peeking"
          width={84}
          className="absolute bottom-[26%] left-[6%] sm:left-[12%]"
          sway={3}
          alt="A cat peeking from behind the stems"
          onClick={() => say("peek")}
          label="Talk to the peeking cat"
        />
        <Cat
          cast="cosy"
          width={92}
          className="absolute bottom-[22%] right-[5%] sm:right-[10%]"
          float
          alt="A cat bundled in a blanket"
          onClick={() => say("cosy")}
          label="Talk to the cosy cat"
        />

        {/* ground: a soft sage hill so the flowers have something to grow from */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[38%] rounded-t-[50%]"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 100%, #dfe7d5 0%, #eaf0e2 55%, rgba(234,240,226,0) 100%)",
          }}
        />

        {/* flowers */}
        {blooms.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => bloom(b)}
            aria-label="Make the flower bloom"
            className="absolute cursor-pointer"
            style={{
              left: `${b.left}%`,
              bottom: `${b.bottom}%`,
            }}
          >
            <motion.span
              className="block origin-bottom"
              animate={
                reduced
                  ? {}
                  : { rotate: [-b.tilt, b.tilt, -b.tilt] }
              }
              transition={{
                duration: 5 + (b.id % 4),
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ display: "block" }}
            >
              <motion.span
                animate={{ width: b.size, height: b.size }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 240, damping: 18 }
                }
                style={{ display: "block" }}
              >
                <Flower
                  shape={b.shape}
                  hue={b.hue}
                  stem
                  size={b.size}
                  style={{ width: "100%", height: "auto" }}
                />
              </motion.span>
            </motion.span>
          </button>
        ))}

        <Petal
          size={13}
          color="#f8dce5"
          className="pointer-events-none absolute left-[30%] top-[38%] opacity-80"
        />
        <Petal
          size={11}
          color="#f6e9a9"
          className="pointer-events-none absolute right-[26%] top-[52%] opacity-75"
        />
      </div>

      <div className="relative z-10 mt-8 flex flex-col items-center gap-4">
        <p className="text-center font-hand text-lg text-[var(--ink-soft)]">
          {bloomedCount === 0
            ? "tap the flowers, the cats, anything you like"
            : bloomedCount < 3
              ? "a little more, they're only just waking up"
              : "the whole garden is awake now"}
        </p>
        <button type="button" onClick={onContinue} className="btn btn-primary px-8">
          Pick some flowers
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
