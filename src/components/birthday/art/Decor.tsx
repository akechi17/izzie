/**
 * Small hand-drawn decorations: balloons, bunting, sparkles, petals, tape,
 * clouds and a cake. All SVG so they scale cleanly and never 404.
 */

type Deco = { className?: string; style?: React.CSSProperties };

export function Balloon({
  color = "#f8dce5",
  outline = "#d89bb0",
  className,
  style,
}: Deco & { color?: string; outline?: string }) {
  return (
    <svg
      viewBox="0 0 80 130"
      width={80}
      height={130}
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M40 6 C20 6 9 22 9 42 C9 62 23 79 38 84 L40 92 L42 84 C57 79 71 62 71 42 C71 22 60 6 40 6 Z"
        fill={color}
      />
      <path
        d="M40 6 C20 6 9 22 9 42 C9 62 23 79 38 84"
        fill="none"
        stroke={outline}
        strokeWidth={1.8}
        opacity={0.75}
      />
      <ellipse cx={27} cy={30} rx={6} ry={9} fill="#fff" opacity={0.55} transform="rotate(-20 27 30)" />
      <path
        d="M40 92 C36 100 44 104 39 112 C35 118 42 120 40 128"
        fill="none"
        stroke={outline}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.8}
      />
      <path d="M40 89 l-4 5 h8 z" fill={outline} opacity={0.8} />
    </svg>
  );
}

export function Bunting({
  count = 7,
  className,
  style,
}: Deco & { count?: number }) {
  const colors = ["#f8dce5", "#f6e9a9", "#c8dfe9", "#b9cbaa", "#eeaec2"];
  const span = 700;
  const step = span / count;
  const sag = 26;
  return (
    <svg
      viewBox={`0 0 ${span} 90`}
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d={`M0 10 Q ${span / 2} ${10 + sag * 2} ${span} 10`}
        fill="none"
        stroke="#c9b6a8"
        strokeWidth={2}
      />
      {Array.from({ length: count }).map((_, i) => {
        const x = step * i + step / 2;
        const t = x / span;
        const y = 10 + 4 * sag * t * (1 - t) + 2;
        return (
          <path
            key={i}
            d={`M${x - 17} ${y} L${x + 17} ${y} L${x} ${y + 34} Z`}
            fill={colors[i % colors.length]}
            stroke="rgba(118,91,88,0.12)"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}

export function Sparkle({
  color = "#f6e9a9",
  size = 26,
  className,
  style,
}: Deco & { color?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M20 0 C21.5 12 28 18.5 40 20 C28 21.5 21.5 28 20 40 C18.5 28 12 21.5 0 20 C12 18.5 18.5 12 20 0 Z"
        fill={color}
      />
    </svg>
  );
}

export function Petal({
  color = "#f8dce5",
  size = 18,
  className,
  style,
}: Deco & { color?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M12 1 C18 5 22 10 20 16 C18.5 20.5 14 22 12 23 C10 22 5.5 20.5 4 16 C2 10 6 5 12 1 Z"
        fill={color}
      />
    </svg>
  );
}

export function Cloud({
  className,
  style,
  color = "#ffffff",
}: Deco & { color?: string }) {
  return (
    <svg
      viewBox="0 0 160 70"
      width={160}
      height={70}
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M22 62 C6 62 0 48 10 38 C4 26 16 15 29 20 C33 6 55 2 66 14 C74 2 96 4 101 18 C116 10 133 20 130 34 C145 36 150 52 138 60 C126 67 40 66 22 62 Z"
        fill={color}
      />
    </svg>
  );
}

export function Tape({
  className,
  style,
  width = 70,
}: Deco & { width?: number }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "block",
        width,
        height: 22,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15)), #f3e4c4",
        borderLeft: "1px dashed rgba(118,91,88,0.18)",
        borderRight: "1px dashed rgba(118,91,88,0.18)",
        boxShadow: "0 2px 6px -3px rgba(118,91,88,0.5)",
        opacity: 0.85,
        transform: "rotate(-3deg)",
        ...style,
      }}
    />
  );
}

export function Ribbon({ className, style }: Deco) {
  return (
    <svg viewBox="0 0 140 90" width={140} height={90} className={className} style={style} aria-hidden>
      <path
        d="M70 42 C52 18 26 14 22 30 C18 46 42 54 70 48 Z"
        fill="#f0b8c9"
      />
      <path
        d="M70 42 C88 18 114 14 118 30 C122 46 98 54 70 48 Z"
        fill="#f8dce5"
      />
      <path
        d="M66 48 C60 62 48 76 42 84"
        stroke="#f0b8c9"
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M74 48 C80 62 92 76 98 84"
        stroke="#f8dce5"
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={70} cy={46} r={9} fill="#eeaec2" />
      <circle cx={70} cy={46} r={9} fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.7} />
    </svg>
  );
}

export function GiftBox({ className, style }: Deco) {
  return (
    <svg viewBox="0 0 140 140" width={140} height={140} className={className} style={style} aria-hidden>
      <rect x={18} y={54} width={104} height={70} rx={8} fill="#f8dce5" />
      <rect x={18} y={54} width={104} height={70} rx={8} fill="none" stroke="#e2a9bd" strokeWidth={1.6} />
      <rect x={12} y={40} width={116} height={26} rx={7} fill="#fdf0f4" />
      <rect x={12} y={40} width={116} height={26} rx={7} fill="none" stroke="#e2a9bd" strokeWidth={1.6} />
      <rect x={60} y={40} width={20} height={84} fill="#f6e9a9" />
      <path
        d="M70 40 C56 30 40 22 34 30 C28 38 46 44 70 40 Z"
        fill="#f6e9a9"
        stroke="#e2cf85"
        strokeWidth={1.2}
      />
      <path
        d="M70 40 C84 30 100 22 106 30 C112 38 94 44 70 40 Z"
        fill="#f6e9a9"
        stroke="#e2cf85"
        strokeWidth={1.2}
      />
      <circle cx={70} cy={40} r={6} fill="#efd889" stroke="#e2cf85" strokeWidth={1.2} />
    </svg>
  );
}

/** The fold the flap hinges on, in user units. */
const ENV_HINGE_Y = 80;
/** Where the flap's point meets the pocket when shut — the centre of the "X". */
const ENV_TIP_Y = 158;

/**
 * The sealed envelope.
 *
 * Shut, it is the classic front-on view: the two side flaps fold in from the
 * corners and the top flap folds *down* over them, its point landing in the
 * middle of the X. The flap is split into two layers so it can swing past
 * vertical — the front face folds away edge-on (first half), then the back
 * face comes over the top (second half) and a companion note rises out.
 */
export function EnvelopeArt({
  className,
  style,
  open = false,
}: Deco & { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 320 242"
      width={320}
      height={242}
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <linearGradient id="envPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset="1" stopColor="#f6e5d3" />
        </linearGradient>
        <linearGradient id="envInside" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6d1be" />
          <stop offset="1" stopColor="#f9eddf" />
        </linearGradient>
      </defs>

      {/* 1 — the back panel: what you see once the flap is out of the way */}
      <rect
        x={16}
        y={ENV_HINGE_Y}
        width={288}
        height={152}
        rx={14}
        fill="url(#envInside)"
        stroke="#dfc7b5"
        strokeWidth={1.8}
      />
      <path
        d={`M16 ${ENV_HINGE_Y} L160 ${ENV_TIP_Y - 12} L304 ${ENV_HINGE_Y} Z`}
        fill="#d9c2ae"
        opacity={0.45}
      />

      {/* 2 — the top flap seen from behind, i.e. after it has swung past
             90°. Same triangle, mirrored up about the hinge, so the two
             layers together read as one continuous fold. */}
      <g
        style={{
          transform: open ? "scaleY(-1)" : "scaleY(0)",
          transformOrigin: `160px ${ENV_HINGE_Y}px`,
          transformBox: "view-box",
          transition: open
            ? "transform 300ms ease-out 300ms"
            : "transform 1ms linear",
        }}
      >
        <path
          d={`M16 ${ENV_HINGE_Y} L160 ${ENV_TIP_Y} L304 ${ENV_HINGE_Y} Z`}
          fill="#f9e3ea"
          stroke="#dfc7b5"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </g>

      {/* 3 — the note, tucked inside until the flap is out of the way */}
      <g
        style={{
          transform: open ? "translateY(-86px)" : "translateY(0px)",
          transition: "transform 620ms cubic-bezier(.22,.9,.24,1) 300ms",
        }}
      >
        <rect
          x={56}
          y={92}
          width={208}
          height={126}
          rx={9}
          fill="#fffdf8"
          stroke="#e3d2c0"
          strokeWidth={1.6}
        />
        <path
          d="M78 128 C74 122 66 122 66 129 C66 135 74 140 78 145 C82 140 90 135 90 129 C90 122 82 122 78 128 Z"
          fill="#f0b8c9"
        />
        {[
          [112, 122, 92],
          [78, 160, 164],
          [78, 178, 136],
        ].map(([x, y, w], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={6}
            rx={3}
            fill="#efdcd2"
          />
        ))}
      </g>

      {/* 4 — the side and bottom flaps: the rounded body with a V cut out of
             the top, so the folded-down top flap completes the X */}
      <path
        d={`M16 ${ENV_HINGE_Y} L160 ${ENV_TIP_Y} L304 ${ENV_HINGE_Y} V218 A14 14 0 0 1 290 232 H30 A14 14 0 0 1 16 218 Z`}
        fill="url(#envPaper)"
        stroke="#dfc7b5"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d={`M30 226 L160 ${ENV_TIP_Y} L290 226`}
        fill="none"
        stroke="#ead7c5"
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* 5 — the top flap folded down over everything, with its wax seal */}
      <g
        style={{
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transformOrigin: `160px ${ENV_HINGE_Y}px`,
          transformBox: "view-box",
          opacity: open ? 0 : 1,
          transition: open
            ? "transform 300ms ease-in, opacity 1ms linear 300ms"
            : "transform 300ms ease-out, opacity 1ms linear",
        }}
      >
        <path
          d={`M16 ${ENV_HINGE_Y} L160 ${ENV_TIP_Y} L304 ${ENV_HINGE_Y} Z`}
          fill="#fbe6ec"
          stroke="#dfc7b5"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <path
          d={`M16 ${ENV_HINGE_Y} L160 ${ENV_TIP_Y} L304 ${ENV_HINGE_Y}`}
          fill="none"
          stroke="#e8cdd6"
          strokeWidth={1.4}
        />
        <circle cx={160} cy={150} r={15} fill="#f6c9d6" stroke="#dda6b8" strokeWidth={1.5} />
        <path
          d="M160 143 C155 146.5 155 153 160 156.5 C165 153 165 146.5 160 143 Z"
          fill="#fffaf2"
          opacity={0.85}
        />
      </g>
    </svg>
  );
}

export function Cake({
  candlesOut = false,
  className,
  style,
}: Deco & { candlesOut?: boolean }) {
  const flames = [72, 104, 136];
  return (
    <svg viewBox="0 0 208 210" width={208} height={210} className={className} style={style} aria-hidden>
      {/* plate */}
      <ellipse cx={104} cy={192} rx={94} ry={13} fill="#e9dccd" opacity={0.75} />
      <ellipse cx={104} cy={188} rx={86} ry={11} fill="#fdf7ef" stroke="#e5d2c1" strokeWidth={1.4} />
      {/* bottom tier */}
      <rect x={26} y={138} width={156} height={50} rx={12} fill="#fbe9ef" stroke="#e8bccd" strokeWidth={1.8} />
      <path d="M26 158 C44 150 60 166 78 158 C96 150 112 166 130 158 C148 150 164 166 182 158 L182 138 L26 138 Z" fill="#fff4e5" opacity={0.8} />
      {/* middle tier */}
      <rect x={44} y={104} width={120} height={38} rx={11} fill="#fff4e5" stroke="#e8d3bd" strokeWidth={1.8} />
      <path d="M44 120 C58 113 72 127 86 120 C100 113 114 127 128 120 C142 113 152 127 164 120 L164 104 L44 104 Z" fill="#f8dce5" opacity={0.75} />
      {/* top tier */}
      <rect x={62} y={76} width={84} height={32} rx={10} fill="#fbe9ef" stroke="#e8bccd" strokeWidth={1.8} />
      <path d="M62 90 C72 84 82 96 92 90 C102 84 112 96 122 90 C132 84 140 94 146 90 L146 76 L62 76 Z" fill="#fff4e5" opacity={0.8} />
      {/* sprinkles */}
      {[
        [40, 168, -18],
        [58, 176, 12],
        [150, 168, 22],
        [170, 176, -8],
        [78, 132, 16],
        [130, 128, -14],
      ].map(([x, y, r], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={9}
          height={3.4}
          rx={1.7}
          fill={["#f6e9a9", "#b9cbaa", "#c8dfe9"][i % 3]}
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
      {/* candles */}
      {flames.map((x, i) => (
        <g key={x}>
          <rect x={x - 3} y={44} width={6} height={34} rx={3} fill={i % 2 ? "#c8dfe9" : "#f6e9a9"} stroke="#e0cdae" strokeWidth={1} />
          <rect x={x - 3} y={44} width={6} height={6} rx={3} fill="#fff" opacity={0.5} />
          {candlesOut ? (
            <g opacity={0.55}>
              <path
                d={`M${x} 40 C${x - 5} 32 ${x + 4} 28 ${x} 20 C${x + 6} 27 ${x + 5} 34 ${x} 40 Z`}
                fill="#e7ddd4"
                opacity={0.7}
              />
            </g>
          ) : (
            <g>
              <ellipse cx={x} cy={35} rx={8} ry={11} fill="#f6e9a9" opacity={0.35} />
              <path
                d={`M${x} 18 C${x - 6} 26 ${x - 4} 38 ${x} 40 C${x + 4} 38 ${x + 6} 26 ${x} 18 Z`}
                fill="#f5a94f"
              />
              <path
                d={`M${x} 26 C${x - 3} 30 ${x - 2} 36 ${x} 37 C${x + 2} 36 ${x + 3} 30 ${x} 26 Z`}
                fill="#fff3c4"
              />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

/** A soft blob used as a background wash so scenes never feel flat. */
export function Blob({
  color = "#f8dce5",
  className,
  style,
}: Deco & { color?: string }) {
  return (
    <svg viewBox="0 0 300 220" width={300} height={220} className={className} style={style} aria-hidden>
      <path
        d="M158 8 C214 4 268 40 276 96 C284 152 240 202 178 210 C116 218 52 190 30 138 C8 86 34 30 92 14 C114 8 136 10 158 8 Z"
        fill={color}
      />
    </svg>
  );
}
