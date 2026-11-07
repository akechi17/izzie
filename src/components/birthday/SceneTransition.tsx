"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A page-turn between scenes: the outgoing scene fades and lifts a touch,
 * the incoming one settles in. Reduced motion collapses to a plain crossfade.
 */
export function SceneTransition({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      key={id}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.995 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.995 }}
      transition={{ duration: reduced ? 0.16 : 0.44, ease: [0.22, 0.9, 0.27, 1] }}
      className="relative w-full"
      aria-live="polite"
    >
      {children}
    </motion.section>
  );
}
