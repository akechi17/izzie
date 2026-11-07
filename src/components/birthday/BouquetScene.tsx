"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { birthday } from "@/config/birthday";
import type { FlowerChoice } from "@/config/birthday";
import { Flower } from "./art/Flower";
import { Bouquet } from "./art/Bouquet";
import { Cat } from "./art/Cat";
import { Sparkle } from "./art/Decor";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Pick = { key: string; choice: FlowerChoice };

let uid = 0;

/**
 * Scene E — choose flowers, then give them.
 * Each tap adds one stem with a small pop; the arrangement is capped so it
 * can't turn into a hedge, and every stem can be taken back out.
 */
export function BouquetScene({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [given, setGiven] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of picks) map[p.choice.id] = (map[p.choice.id] ?? 0) + 1;
    return map;
  }, [picks]);

  const total = picks.length;
  const maxTotal = 14;

  const add = (choice: FlowerChoice) => {
    if ((counts[choice.id] ?? 0) >= choice.limit) return;
    if (total >= maxTotal) return;
    uid += 1;
    setPicks((p) => [...p, { key: `${choice.id}-${uid}`, choice }]);
  };

  const remove = (choiceId: string) => {
    setPicks((p) => {
      const idx = [...p].reverse().findIndex((x) => x.choice.id === choiceId);
      if (idx === -1) return p;
      const realIndex = p.length - 1 - idx;
      return p.filter((_, i) => i !== realIndex);
    });
  };

  /** The picks, in the shape the bouquet art wants. */
  const stems = useMemo(
    () =>
      picks.map((p) => ({
        key: p.key,
        shape: p.choice.shape,
        hue: p.choice.hue,
      })),
    [picks],
  );

  if (given) {
    return (
      <div className="relative mx-auto w-full max-w-2xl px-5 pb-10 pt-6">
        <div className="text-center">
          <p className="tiny-caps">chapter four · the flowers</p>
          <h1 className="mt-3 text-[1.7rem] leading-snug sm:text-[2.2rem]">
            For you, {birthday.recipientName}.
          </h1>
        </div>

        <div className="paper-card relative mx-auto mt-8 max-w-sm overflow-hidden px-6 pb-7 pt-10">
          <Sparkle size={18} className="absolute right-5 top-5" color="#f6e9a9" />
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
            className="relative mx-auto"
          >
            <Bouquet
              items={stems}
              width={264}
              className="mx-auto drop-shadow-[0_10px_18px_rgba(118,91,88,0.14)]"
            />
          </motion.div>

          <p className="mt-6 text-center font-hand text-xl leading-snug text-[var(--ink-soft)]">
            {birthday.bouquetMessage}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setGiven(false);
              setPicks([]);
            }}
            className="btn btn-quiet text-sm"
          >
            Pick a different bunch
          </button>
          <button type="button" onClick={onContinue} className="btn btn-primary px-8">
            There&apos;s a letter too
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl px-5 pb-8 pt-4">
      <header className="text-center">
        <p className="tiny-caps">chapter four · the flowers</p>
        <h1 className="mx-auto mt-3 max-w-[24ch] text-[1.6rem] leading-snug sm:text-[2.1rem]">
          Pick whatever you like.
        </h1>
      </header>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1.05fr] sm:items-start">
        {/* the bouquet preview */}
        <div
          className="relative order-2 min-h-[17rem] overflow-hidden rounded-3xl border sm:order-1"
          style={{
            borderColor: "rgba(118,91,88,0.14)",
            background:
              "radial-gradient(80% 70% at 50% 100%, #f4ece0 0%, #fffaf2 70%)",
          }}
        >
          {picks.length === 0 ? (
            <div className="absolute inset-0 grid place-items-center px-10 text-center">
              <p className="font-hand text-lg text-[var(--ink-soft)]">
                tap a flower below and it lands here
              </p>
            </div>
          ) : (
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="absolute inset-x-0 bottom-2 mx-auto w-fit"
            >
              <Bouquet items={stems} width={252} />
            </motion.div>
          )}

          <Cat
            cast="bouquet"
            width={58}
            className="absolute bottom-2 right-2 opacity-90"
            alt=""
          />
        </div>

        {/* the picking panel */}
        <div className="order-1 sm:order-2">
          <ul className="space-y-2.5">
            {birthday.flowerChoices.map((choice) => {
              const n = counts[choice.id] ?? 0;
              const full = n >= choice.limit;
              return (
                <li key={choice.id}>
                  <div
                    className="flex items-center gap-3 rounded-2xl border px-3 py-2.5"
                    style={{
                      borderColor: "rgba(118,91,88,0.13)",
                      background: "#fffaf2",
                    }}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center">
                      <Flower shape={choice.shape} hue={choice.hue} size={34} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.95rem] font-bold">
                        {choice.label}
                      </p>
                      <p className="text-xs text-[var(--ink-soft)]">
                        {n} of {choice.limit}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => remove(choice.id)}
                        disabled={n === 0}
                        aria-label={`Remove one ${choice.label}`}
                        className="grid h-9 w-9 place-items-center rounded-xl border text-lg leading-none disabled:opacity-35"
                        style={{ borderColor: "rgba(118,91,88,0.2)" }}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() => add(choice)}
                        disabled={full || total >= maxTotal}
                        aria-label={`Add one ${choice.label}`}
                        className="grid h-9 w-9 place-items-center rounded-xl border text-lg leading-none disabled:opacity-35"
                        style={{
                          borderColor: "rgba(118,91,88,0.2)",
                          background: full ? "transparent" : "#f6e9a9",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 text-center sm:text-left">
            <p className="font-hand text-lg text-[var(--ink-soft)]">
              {total === 0
                ? "a bouquet with nothing in it is still a bouquet, technically"
                : `${total} stem${total === 1 ? "" : "s"} so far`}
            </p>
            <button
              type="button"
              onClick={() => setGiven(true)}
              disabled={total === 0}
              className="btn btn-primary mt-3 w-full px-8"
            >
              Take Your Bouquet
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {total >= maxTotal && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-xs text-[var(--ink-soft)]"
            role="status"
          >
            That&apos;s a full armful — take one out to swap it.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
