/**
 * Tiny audio controller around a single <audio> element.
 *
 * Why not Howler? It would be a ~30kB dependency for what amounts to
 * play / pause / seek / volume. This keeps the bundle honest and lets us
 * surface a friendly "missing file" state instead of a console error.
 */

export type AudioStatus = "idle" | "loading" | "playing" | "paused" | "missing";

export type AudioSnapshot = {
  status: AudioStatus;
  currentTime: number;
  duration: number;
  volume: number;
};

type Listener = (snapshot: AudioSnapshot) => void;

const EMPTY: AudioSnapshot = {
  status: "idle",
  currentTime: 0,
  duration: 0,
  volume: 0.7,
};

class AudioController {
  private el: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private snapshot: AudioSnapshot = { ...EMPTY };
  private src = "";
  private raf = 0;

  constructor() {
    if (typeof window === "undefined") return;
    this.snapshot.volume = this.readStoredVolume();
  }

  private readStoredVolume() {
    try {
      const raw = window.localStorage.getItem("izzah.volume");
      const n = raw === null ? NaN : Number(raw);
      if (Number.isFinite(n)) return Math.min(1, Math.max(0, n));
    } catch {
      /* private mode */
    }
    return 0.7;
  }

  private persistVolume(v: number) {
    try {
      window.localStorage.setItem("izzah.volume", String(v));
    } catch {
      /* ignore */
    }
  }

  private ensure(src: string) {
    if (typeof window === "undefined") return null;
    if (this.el && this.src === src) return this.el;

    if (this.el) {
      this.el.pause();
      this.el.removeAttribute("src");
      this.el.load();
    }

    this.src = src;
    const el = new Audio();
    el.preload = "metadata";
    el.loop = false;
    el.volume = this.snapshot.volume;
    el.crossOrigin = "anonymous";
    el.addEventListener("loadedmetadata", () => {
      this.patch({
        status: el.paused ? "paused" : "playing",
        duration: el.duration || 0,
      });
    });
    el.addEventListener("timeupdate", () =>
      this.patch({ currentTime: el.currentTime }),
    );
    el.addEventListener("play", () => this.patch({ status: "playing" }));
    el.addEventListener("pause", () => {
      if (this.snapshot.status !== "missing") this.patch({ status: "paused" });
    });
    el.addEventListener("ended", () =>
      this.patch({ status: "paused", currentTime: 0 }),
    );
    el.addEventListener("error", () => {
      // Most likely the placeholder mp3 has not been supplied yet.
      this.patch({ status: "missing" });
    });
    el.src = src;
    this.el = el;
    this.patch({ status: "loading" });
    return el;
  }

  private patch(next: Partial<AudioSnapshot>) {
    this.snapshot = { ...this.snapshot, ...next };
    for (const l of this.listeners) l(this.snapshot);
    if (this.snapshot.status === "playing") this.tick();
  }

  private tick = () => {
    if (this.snapshot.status !== "playing") return;
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      if (this.el) this.patch({ currentTime: this.el.currentTime });
    });
  };

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.snapshot);
    return () => {
      this.listeners.delete(fn);
    };
  }

  getSnapshot() {
    return this.snapshot;
  }

  async play(src: string) {
    const el = this.ensure(src);
    if (!el) return;
    try {
      await el.play();
      this.patch({ status: "playing" });
    } catch {
      // Autoplay blocked or the file is absent — the listener already fired
      // with "missing" if it was a load error.
      if (this.snapshot.status !== "missing") this.patch({ status: "paused" });
    }
  }

  pause() {
    this.el?.pause();
  }

  toggle(src: string) {
    if (this.snapshot.status === "playing") this.pause();
    else void this.play(src);
  }

  seek(seconds: number) {
    if (!this.el) return;
    const clamped = Math.min(Math.max(0, seconds), this.snapshot.duration || 0);
    this.el.currentTime = clamped;
    this.patch({ currentTime: clamped });
  }

  setVolume(v: number) {
    const clamped = Math.min(1, Math.max(0, v));
    if (this.el) this.el.volume = clamped;
    this.persistVolume(clamped);
    this.patch({ volume: clamped });
  }

  restart() {
    if (!this.el) return;
    this.el.currentTime = 0;
    this.patch({ currentTime: 0 });
  }
}

let controller: AudioController | null = null;

export function getAudio() {
  if (typeof window === "undefined") return null;
  if (!controller) controller = new AudioController();
  return controller;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
