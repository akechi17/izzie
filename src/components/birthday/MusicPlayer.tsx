"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { birthday } from "@/config/birthday";
import { formatTime, getAudio, type AudioSnapshot } from "@/lib/audio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Cat } from "./art/Cat";

function useAudio() {
  const [snap, setSnap] = useState<AudioSnapshot>({
    status: "idle",
    currentTime: 0,
    duration: 0,
    volume: 0.7,
  });

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;
    return audio.subscribe(setSnap);
  }, []);

  return snap;
}

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <rect x={6} y={5} width={4} height={14} rx={1.6} fill="currentColor" />
      <rect x={14} y={5} width={4} height={14} rx={1.6} fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <path d="M8 5.5 L18 12 L8 18.5 Z" fill="currentColor" />
    </svg>
  );
}

function Waveform({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const bars = [10, 18, 26, 16, 22, 12, 20, 14, 24, 11, 17, 13];
  return (
    <div className="flex h-7 items-end gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: "rgba(118,91,88,0.32)" }}
          initial={false}
          animate={
            active && !reduced
              ? { height: [h * 0.5, h, h * 0.6, h * 0.9, h * 0.45] }
              : { height: h * 0.55 }
          }
          transition={
            active && !reduced
              ? {
                  duration: 1.5 + i * 0.09,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

/**
 * Scene B — the song. Introduced right after the envelope opens.
 * The player is deliberately low-key: this is a gift, not a landing page.
 */
export function MusicPlayer({ onContinue }: { onContinue: () => void }) {
  const snap = useAudio();
  const [started, setStarted] = useState(false);
  const audio = getAudio();
  const missing = snap.status === "missing";
  const playing = snap.status === "playing";
  const progress =
    snap.duration > 0 ? Math.min(1, snap.currentTime / snap.duration) : 0;

  const handlePlay = async () => {
    if (!audio) return;
    setStarted(true);
    if (playing) audio.pause();
    else await audio.play(birthday.musicSrc);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-7">
      <div className="relative">
        <div
          aria-hidden
          className="absolute -left-6 -top-5 h-24 w-24 rotate-[-8deg] rounded-full"
          style={{ background: "#f6e9a9", opacity: 0.55 }}
        />
        <Cat cast="sitting" width={350} className="relative -mb-4 ml-2" float sway={3} alt="A small cream cat tapping its paw" />
        <div className="paper-card relative overflow-hidden p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <div
              aria-hidden
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #f8dce5 0 6px, #fdf0f4 6px 12px)",
                borderColor: "rgba(118,91,88,0.15)",
              }}
            >
              <svg viewBox="0 0 32 32" width={26} height={26} aria-hidden>
                <path
                  d="M12 22 V9 l12 -3 v13"
                  fill="none"
                  stroke="#765b58"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx={9.5} cy={23} r={3.2} fill="#765b58" />
                <circle cx={21.5} cy={20} r={3.2} fill="#765b58" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="tiny-caps">Now playing</p>
              <h2 className="mt-1 truncate text-xl font-semibold sm:text-2xl">
                {birthday.musicTitle}
              </h2>
              <p className="truncate text-sm text-[var(--ink-soft)]">
                {birthday.musicArtist}
              </p>
            </div>
            <Waveform active={playing} />
          </div>

          <div className="mt-6">
            <label htmlFor="song-progress" className="sr-only">
              Song position
            </label>
            <input
              id="song-progress"
              type="range"
              min={0}
              max={Math.max(1, snap.duration || 1)}
              step={0.1}
              value={snap.currentTime}
              disabled={!snap.duration || missing}
              onChange={(e) => audio?.seek(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(90deg, #e2a9bd ${progress * 100}%, rgba(118,91,88,0.14) ${progress * 100}%)`,
                accentColor: "#d89bb0",
              }}
            />
            <div className="mt-2 flex justify-between text-xs tabular-nums text-[var(--ink-soft)]">
              <span>{formatTime(snap.currentTime)}</span>
              <span>{formatTime(snap.duration)}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlay}
              className="btn btn-primary flex-1"
            >
              <PlayIcon playing={playing} />
              {playing ? "Pause" : started ? "Play again" : "Play it for me"}
            </button>
            <div className="flex items-center gap-2">
              <label htmlFor="song-volume" className="sr-only">
                Volume
              </label>
              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden className="text-[var(--ink-soft)]">
                <path
                  d="M4 10 h3 l5 -4 v12 l-5 -4 H4 Z"
                  fill="currentColor"
                  opacity={0.75}
                />
                <path
                  d="M16 9 C18 11 18 13 16 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  opacity={snap.volume > 0.05 ? 0.9 : 0.3}
                />
              </svg>
              <input
                id="song-volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={snap.volume}
                onChange={(e) => audio?.setVolume(Number(e.target.value))}
                className="h-1.5 w-16 cursor-pointer appearance-none rounded-full sm:w-20"
                style={{
                  background: `linear-gradient(90deg, #b9cbaa ${snap.volume * 100}%, rgba(118,91,88,0.14) ${snap.volume * 100}%)`,
                }}
              />
            </div>
          </div>

          {missing ? (
            <p
              className="mt-4 rounded-xl border border-dashed px-3 py-2 text-sm"
              style={{
                borderColor: "rgba(118,91,88,0.25)",
                background: "#fffaf2",
                color: "var(--ink-soft)",
              }}
            >
              The song file isn&apos;t in the box yet — add{" "}
              <code className="rounded bg-[#f6e9a9]/60 px-1 text-[0.82em]">
                public/assets/music/birthday-song.mp3
              </code>{" "}
              and it will play here.
            </p>
          ) : (
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              {playing
                ? "♪ it keeps playing while you wander through the pages."
                : "Press play whenever you're ready — sound is entirely up to you."}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="font-hand text-lg text-[var(--ink-soft)]">
          no rush, take it in
        </p>
        <button type="button" onClick={onContinue} className="btn">
          Continue
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

/**
 * The persistent little disc that appears once the song has begun, so the
 * visitor never has to hunt for the player again.
 */
export function MiniPlayer() {
  const snap = useAudio();
  const audio = getAudio();
  const active =
    snap.status === "playing" ||
    snap.status === "paused" ||
    snap.status === "loading";

  if (!active) return null;

  const playing = snap.status === "playing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="paper-card flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-1.5"
    >
      <button
        type="button"
        onClick={() => audio?.toggle(birthday.musicSrc)}
        aria-label={playing ? "Pause music" : "Play music"}
        className="grid h-8 w-8 place-items-center rounded-full border transition-colors"
        style={{
          background: playing ? "#f6c9d6" : "#fffaf2",
          borderColor: "rgba(118,91,88,0.18)",
        }}
      >
        <PlayIcon playing={playing} />
      </button>
      <span className="hidden max-w-[9rem] truncate text-xs font-semibold text-[var(--ink-soft)] sm:block">
        {birthday.musicTitle}
      </span>
      <Waveform active={playing} />
    </motion.div>
  );
}
