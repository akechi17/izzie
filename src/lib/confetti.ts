/**
 * Confetti without a dependency.
 *
 * Draws petals and dots on a single canvas for a short burst, then stops the
 * animation loop and removes the canvas. Entirely skipped when the visitor
 * prefers reduced motion.
 */

const COLORS = ["#f8dce5", "#f6e9a9", "#c8dfe9", "#b9cbaa", "#eeaec2", "#fff4e5"];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  petal: boolean;
  life: number;
};

export function burstConfetti(
  origin?: { x: number; y: number },
  opts?: { count?: number; spread?: number; duration?: number },
) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const count = opts?.count ?? 46;
  const spread = opts?.spread ?? 1;
  const life = opts?.duration ?? 2200;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:70";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  document.body.appendChild(canvas);

  const cx = origin?.x ?? window.innerWidth / 2;
  const cy = origin?.y ?? window.innerHeight * 0.42;

  const pieces: Piece[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * spread;
    const speed = 5 + Math.random() * 9;
    return {
      x: cx + (Math.random() - 0.5) * 90,
      y: cy + (Math.random() - 0.5) * 26,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.22,
      size: 4 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      petal: Math.random() > 0.55,
      life: 1,
    };
  });

  const start = performance.now();
  let raf = 0;

  const frame = (now: number) => {
    const t = now - start;
    if (t > life) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const fade = Math.min(1, Math.max(0, (life - t) / 700));
    for (const p of pieces) {
      p.vy += 0.19;
      p.vx *= 0.992;
      p.vy *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade;
      ctx.fillStyle = p.color;
      if (p.petal) {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      }
      ctx.restore();
    }
    raf = requestAnimationFrame(frame);
  };

  raf = requestAnimationFrame(frame);

  // Safety net: remove the canvas even if the tab stalls.
  window.setTimeout(() => {
    cancelAnimationFrame(raf);
    canvas.remove();
  }, life + 400);
}
