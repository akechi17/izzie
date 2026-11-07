"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { birthday, type CastName } from "@/config/birthday";
import type { CSSProperties } from "react";

type CastKey = CastName;

type CatProps = {
  cast: CastKey;
  /** Rendered width in px. Height follows the intrinsic ratio. */
  width: number;
  className?: string;
  style?: CSSProperties;
  /** Gentle idle float. */
  float?: boolean;
  /** Small side-to-side sway, in degrees. */
  sway?: number;
  priority?: boolean;
  alt?: string;
  onClick?: () => void;
  /** Accessible name when the cat is a button. */
  label?: string;
};

/**
 * Every cat in the experience comes from this component so scale, shadow and
 * motion stay consistent — the supplied sticker art is the single source.
 */
export function Cat({
  cast,
  width,
  className,
  style,
  float = false,
  sway = 0,
  priority = false,
  alt = "",
  onClick,
  label,
}: CatProps) {
  const reduced = useReducedMotion();
  const asset = birthday.theme.cast[cast];
  const height = Math.round((width * asset.height) / asset.width);

  const motionProps =
    reduced || (!float && !sway)
      ? {}
      : {
          animate: {
            ...(float ? { y: [0, -8, 0] } : {}),
            ...(sway ? { rotate: [-sway, sway, -sway] } : {}),
          },
          transition: {
            duration: float ? 5.5 : 6.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };

  const inner = (
    <Image
      src={asset.src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className="sticker-img"
      style={{ width, height }}
      draggable={false}
    />
  );

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={label ?? "Tap the cat"}
        className={`cursor-pointer rounded-2xl bg-transparent p-0 transition-transform active:scale-95 ${className ?? ""}`}
        style={style}
        whileTap={{ scale: 0.94 }}
        {...motionProps}
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.span
      className={`block ${className ?? ""}`}
      style={style}
      {...motionProps}
      aria-hidden={alt ? undefined : true}
    >
      {inner}
    </motion.span>
  );
}
