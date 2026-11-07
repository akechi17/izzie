"use client";

import { motion } from "motion/react";
import { SCENES } from "./scenes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  index: number;
  onJump: (index: number) => void;
  /** Scenes the visitor has already unlocked. */
  unlockedUpTo: number;
};

/**
 * A slim stitched ribbon of dots. Past scenes are clickable to rewind;
 * future ones stay quiet until reached, so nothing feels like a to-do list.
 */
export function ProgressIndicator({ index, onJump, unlockedUpTo }: Props) {
  const reduced = useReducedMotion();
  const total = SCENES.length;

  return (
    <nav aria-label="The story so far" className="flex items-center gap-3">
      <div className="relative flex items-center">
        <span
          aria-hidden
          className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(118,91,88,0.22) 0 5px, transparent 5px 9px)",
          }}
        />
        <ol className="relative flex items-center gap-2.5">
          {SCENES.map((scene, i) => {
            const done = i < index;
            const current = i === index;
            const unlocked = i <= unlockedUpTo;
            return (
              <li key={scene.key} className="flex">
                <button
                  type="button"
                  onClick={() => unlocked && onJump(i)}
                  disabled={!unlocked}
                  aria-current={current ? "step" : undefined}
                  aria-label={`${i + 1}. ${scene.label}${unlocked ? "" : " (locked)"}`}
                  className="grid h-7 w-7 place-items-center rounded-full transition-colors disabled:cursor-default"
                >
                  <motion.span
                    className="block rounded-full border"
                    animate={{
                      width: current ? 11 : done ? 7 : 7,
                      height: current ? 11 : done ? 7 : 7,
                      backgroundColor: current
                        ? "#c98ba0"
                        : done
                          ? "#e5c4cc"
                          : "#fffaf2",
                      borderColor: current
                        ? "#c98ba0"
                        : done
                          ? "#dcb3bd"
                          : "rgba(118,91,88,0.25)",
                    }}
                    transition={{ duration: reduced ? 0 : 0.25 }}
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="tiny-caps hidden whitespace-nowrap sm:block">
        {index + 1}<span className="opacity-50"> / {total}</span>
      </p>
    </nav>
  );
}
