import { Flower, Sprig, type FlowerShape } from "./Flower";
import { Ribbon } from "./Decor";

export type BouquetStem = { key: string; shape: FlowerShape; hue: string };

/* ---------------------------------------------------------------- geometry
 * Everything is laid out in one fixed 320×312 design box and then scaled to
 * whatever width the caller needs, so the preview and the finished card are
 * literally the same bouquet.
 *
 * The whole illusion rests on a single point: the tie. Every stalk is drawn
 * with its tail pinned to (160, 210) and rotated about that point, so the
 * stems genuinely converge where the ribbon sits and the heads fan out above
 * it — rather than being scattered in a clump.
 */
const W = 320;
const H = 312;
const TIE_X = 160;
const TIE_Y = 210;

/** Head centres sit this far above the tie, before jitter. */
const LEN_MIN = 116;
const LEN_SPAN = 42;
/** Widest stalk angle, in degrees, from vertical. */
const SPREAD = 52;

/** Stable 0–1 noise per (key, salt) so the bunch never reshuffles. */
function noise(key: string, salt: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  }
  for (let i = 0; i < salt.length; i += 1) {
    h = Math.imul(h ^ salt.charCodeAt(i), 16777619);
  }
  return (h >>> 0) / 4294967296;
}

type Placed = BouquetStem & {
  angle: number;
  size: number;
  stemLength: number;
  z: number;
};

function place(items: BouquetStem[]): Placed[] {
  const n = items.length;
  return items.map((item, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const angle =
      -SPREAD + t * SPREAD * 2 + (noise(item.key, "a") - 0.5) * 9;
    const size = 44 + noise(item.key, "s") * 12;
    const len = LEN_MIN + noise(item.key, "l") * LEN_SPAN;

    // Flower heads are drawn around y≈48 in a 90-unit space, and the stem is
    // `stemLength` units longer than that, so solving for the stalk length
    // puts the head centre exactly `len` px above the tie.
    const stemLength = (100 * (len + 0.48 * size)) / size - 90;

    return { ...item, angle, size, stemLength, z: 10 + Math.round(60 - Math.abs(angle)) };
  });
}

/**
 * A hand-tied bouquet: stalks converging from one tie, a paper wrap below,
 * and a ribbon over the knot. Decorative — the surrounding copy carries the
 * meaning, so it stays out of the accessibility tree.
 */
export function Bouquet({
  items,
  width = 320,
  className,
}: {
  items: BouquetStem[];
  width?: number;
  className?: string;
}) {
  const scale = width / W;
  const placed = place(items);

  return (
    <div
      aria-hidden
      className={className}
      style={{ width: W * scale, height: H * scale }}
    >
      <div
        className="relative"
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* filler sprigs, tucked behind the blooms */}
        {[-34, -4, 26].map((angle, i) => (
          <div
            key={`sprig-${i}`}
            className="absolute"
            style={{
              left: TIE_X,
              top: TIE_Y,
              transform: `rotate(${angle}deg)`,
              zIndex: 4,
            }}
          >
            <div style={{ position: "absolute", bottom: 0, left: -13 }}>
              <Sprig color={i === 1 ? "#a8bf98" : "#9db38c"} />
            </div>
          </div>
        ))}

        {/* the blooms themselves */}
        {placed.map((p) => (
          <div
            key={p.key}
            className="absolute"
            style={{
              left: TIE_X,
              top: TIE_Y,
              transform: `rotate(${p.angle}deg)`,
              transformOrigin: "0 0",
              transition: "transform 360ms cubic-bezier(.22,.9,.24,1)",
              zIndex: p.z,
            }}
          >
            <div style={{ position: "absolute", bottom: 0, left: -p.size / 2 }}>
              <Flower
                shape={p.shape}
                hue={p.hue}
                stem
                stemLength={p.stemLength}
                size={p.size}
              />
            </div>
          </div>
        ))}

        {/* the wrap: a paper cone, a fold, then the ribbon over the knot */}
        <svg
          viewBox={`0 0 ${W} 104`}
          width={W}
          height={104}
          className="absolute"
          style={{ left: 0, top: TIE_Y - 1, zIndex: 100 }}
        >
          <path
            d="M160 1 L56 84 Q160 102 264 84 Z"
            fill="#f7e9d8"
            stroke="#dcc5ae"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <path
            d="M160 1 L96 78 Q160 92 224 78 Z"
            fill="#fdf4e8"
            opacity={0.85}
          />
          <path
            d="M160 1 L56 84"
            fill="none"
            stroke="#e6d3bd"
            strokeWidth={1.4}
          />
          <path
            d="M160 1 L264 84"
            fill="none"
            stroke="#e6d3bd"
            strokeWidth={1.4}
          />
          <path
            d="M64 74 Q160 92 256 74"
            fill="none"
            stroke="#e8d6c2"
            strokeWidth={1.4}
            strokeDasharray="4 5"
            opacity={0.9}
          />
        </svg>

        <div
          className="absolute"
          style={{
            left: TIE_X - 43,
            top: TIE_Y - 26,
            width: 86,
            zIndex: 110,
          }}
        >
          <Ribbon style={{ width: 86, height: "auto" }} />
        </div>
      </div>
    </div>
  );
}
