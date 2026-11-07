import type { SVGProps } from "react";

export type FlowerShape =
  | "tulip"
  | "daisy"
  | "rose"
  | "sunflower"
  | "gerbera";

type FlowerProps = {
  shape: FlowerShape;
  hue: string;
  /** Draw a stem and leaves beneath the head. */
  stem?: boolean;
  /** How long that stem is, in the 100-unit drawing space (default 40). */
  stemLength?: number;
  /** Head size in px. */
  size?: number;
  className?: string;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "children">;

/** Darken a hex colour slightly for outlines and petal shading. */
function shade(hex: string, amount = -0.18) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const shift = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + 255 * amount)));
  return `#${((shift(r) << 16) | (shift(g) << 8) | shift(b))
    .toString(16)
    .padStart(6, "0")}`;
}

const STEM = "#8fae7e";
const STEM_DARK = "#7b9a6b";

/**
 * Head geometry, in the 100×90 space every flower family is drawn in, runs
 * roughly y 20→74. The stem picks up just under the head and runs down to
 * `90 + length`, so a bouquet can ask for a long stalk and still share the
 * same head art as a garden bed.
 */
function Stem({ length }: { length: number }) {
  const top = 74;
  const bottom = 90 + length;
  const mid = top + (bottom - top) * 0.42;
  const leaf = top + (bottom - top) * 0.3;
  return (
    <g>
      <path
        d={`M50 ${top} C50 ${mid} 50 ${mid + (bottom - mid) * 0.5} 50 ${bottom}`}
        stroke={STEM}
        strokeWidth={3.2}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M50 ${leaf} C42 ${leaf - 2} 34 ${leaf - 8} 30 ${leaf - 17} C39 ${leaf - 18} 47 ${leaf - 12} 50 ${leaf - 5} Z`}
        fill={STEM}
        opacity={0.92}
      />
      <path
        d={`M50 ${leaf + 10} C58 ${leaf + 8} 66 ${leaf + 2} 70 ${leaf - 7} C61 ${leaf - 8} 53 ${leaf - 2} 50 ${leaf + 5} Z`}
        fill={STEM_DARK}
        opacity={0.85}
      />
    </g>
  );
}

function Tulip({ hue }: { hue: string }) {
  const dark = shade(hue, -0.14);
  const light = shade(hue, 0.12);
  return (
    <g>
      <path
        d="M28 60 C24 36 36 20 50 20 C64 20 76 36 72 60 C66 74 34 74 28 60 Z"
        fill={hue}
      />
      <path
        d="M50 22 C47 38 46 54 49 68 C52 54 53 38 50 22 Z"
        fill={light}
        opacity={0.85}
      />
      <path
        d="M38 24 C33 40 34 56 40 68 C36 52 36 38 40 24 Z"
        fill={dark}
        opacity={0.3}
      />
      <path
        d="M62 24 C67 40 66 56 60 68 C64 52 64 38 60 24 Z"
        fill={dark}
        opacity={0.3}
      />
      <path
        d="M28 60 C36 66 64 66 72 60"
        stroke={dark}
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
        opacity={0.45}
      />
    </g>
  );
}

function Daisy({ hue }: { hue: string }) {
  const petalShade = "#efe6d6";
  return (
    <g>
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse
          key={i}
          cx={50}
          cy={27}
          rx={6.6}
          ry={16}
          fill={hue}
          stroke={petalShade}
          strokeWidth={1}
          transform={`rotate(${i * 36} 50 48)`}
        />
      ))}
      <circle cx={50} cy={48} r={12.5} fill="#f6e9a9" />
      <circle
        cx={50}
        cy={48}
        r={12.5}
        fill="none"
        stroke="#e2cf85"
        strokeWidth={1.4}
      />
      {[
        [46, 44],
        [54, 45],
        [49, 51],
        [55, 52],
        [44, 50],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.5} fill="#dcc478" opacity={0.9} />
      ))}
    </g>
  );
}

function Rose({ hue }: { hue: string }) {
  const dark = shade(hue, -0.16);
  const light = shade(hue, 0.14);
  return (
    <g>
      <circle cx={50} cy={48} r={25} fill={hue} />
      <path
        d="M50 30 C40 30 33 38 34 47 C35 57 44 64 53 62 C61 60 66 52 63 45 C61 39 55 36 50 37 C45 38 42 43 44 47 C46 51 51 51 52 48"
        fill="none"
        stroke={dark}
        strokeWidth={2.4}
        strokeLinecap="round"
        opacity={0.55}
      />
      <path
        d="M50 26 C38 28 27 38 29 51 C31 64 43 72 56 69"
        fill="none"
        stroke={light}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.7}
      />
      <path
        d="M58 30 C67 35 72 44 70 53"
        fill="none"
        stroke={dark}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.35}
      />
    </g>
  );
}

function Sunflower({ hue }: { hue: string }) {
  const petal = hue;
  const petalAlt = shade(hue, -0.08);
  return (
    <g>
      {Array.from({ length: 16 }).map((_, i) => (
        <path
          key={i}
          d="M50 26 C53 16 47 16 50 26 Z"
          fill="transparent"
        />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse
          key={i}
          cx={50}
          cy={25}
          rx={5.2}
          ry={14}
          fill={i % 2 === 0 ? petal : petalAlt}
          transform={`rotate(${i * 22.5} 50 48)`}
        />
      ))}
      <circle cx={50} cy={48} r={14} fill="#a9764f" />
      <circle
        cx={50}
        cy={48}
        r={14}
        fill="none"
        stroke="#8e5f3e"
        strokeWidth={1.4}
      />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={50 + Math.cos(a) * 7}
            cy={48 + Math.sin(a) * 7}
            r={1.6}
            fill="#7d5233"
            opacity={0.75}
          />
        );
      })}
      <circle cx={50} cy={48} r={3.2} fill="#7d5233" opacity={0.6} />
    </g>
  );
}

function Gerbera({ hue }: { hue: string }) {
  const petalAlt = shade(hue, -0.12);
  const disc = shade(hue, -0.34);
  return (
    <g>
      {/* back ring of petals, slightly shorter and darker */}
      {Array.from({ length: 24 }).map((_, i) => (
        <ellipse
          key={`back-${i}`}
          cx={50}
          cy={29}
          rx={3.2}
          ry={13}
          fill={petalAlt}
          transform={`rotate(${i * 15 + 7.5} 50 48)`}
        />
      ))}
      {/* front ring, offset so the petals peek between the back ones */}
      {Array.from({ length: 24 }).map((_, i) => (
        <ellipse
          key={`front-${i}`}
          cx={50}
          cy={26.5}
          rx={3.6}
          ry={15}
          fill={hue}
          stroke={petalAlt}
          strokeWidth={0.5}
          transform={`rotate(${i * 15} 50 48)`}
        />
      ))}
      <circle cx={50} cy={48} r={10.5} fill={disc} />
      <circle
        cx={50}
        cy={48}
        r={10.5}
        fill="none"
        stroke={shade(hue, -0.42)}
        strokeWidth={1.2}
      />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={50 + Math.cos(a) * 5.2}
            cy={48 + Math.sin(a) * 5.2}
            r={1.4}
            fill={shade(hue, -0.5)}
            opacity={0.8}
          />
        );
      })}
      <circle cx={50} cy={48} r={2.6} fill={shade(hue, -0.2)} opacity={0.9} />
    </g>
  );
}

/**
 * One flower family, five shapes — the same 100×110 head geometry so a
 * bouquet built from any mix stays visually level.
 */
export function Flower({
  shape,
  hue,
  stem = false,
  stemLength = 40,
  size = 64,
  className,
  title,
  ...rest
}: FlowerProps) {
  const svgH = stem ? 90 + stemLength : 90;
  return (
    <svg
      viewBox={`0 0 100 ${svgH}`}
      width={size}
      height={(size * svgH) / 100}
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {stem ? <Stem length={stemLength} /> : null}
      {shape === "tulip" ? <Tulip hue={hue} /> : null}
      {shape === "daisy" ? <Daisy hue={hue} /> : null}
      {shape === "rose" ? <Rose hue={hue} /> : null}
      {shape === "sunflower" ? <Sunflower hue={hue} /> : null}
      {shape === "gerbera" ? <Gerbera hue={hue} /> : null}
    </svg>
  );
}

/** A handful of small filler sprigs used to soften a bouquet. */
export function Sprig({
  color = "#9db38c",
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 70" width={26} height={46} className={className} aria-hidden>
      <path
        d="M20 68 C20 52 20 34 20 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      {[18, 30, 42, 54].map((y, i) => (
        <g key={y}>
          <ellipse
            cx={20 - (i % 2 === 0 ? 7 : -7)}
            cy={y}
            rx={7}
            ry={3.6}
            fill={color}
            opacity={0.8}
            transform={`rotate(${i % 2 === 0 ? -28 : 28} ${20 - (i % 2 === 0 ? 7 : -7)} ${y})`}
          />
        </g>
      ))}
    </svg>
  );
}
