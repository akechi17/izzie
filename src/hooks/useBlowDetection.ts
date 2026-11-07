"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MicState =
  | "idle"
  | "requesting"
  | "calibrating"
  | "listening"
  | "denied"
  | "unsupported"
  | "error";

type Options = {
  /** Fires once when a sustained blow is detected. */
  onBlow: () => void;
  /** How long the breath must last, in ms. */
  holdMs?: number;
};

/**
 * Microphone "blow" detection.
 *
 * Deliberately conservative:
 *  1. The mic is only requested when `start()` is called by a user gesture.
 *  2. The first ~700 ms measure the room and set the threshold above it, so a
 *     fan or a conversation does not blow the candles out by itself.
 *  3. A blow must be *sustained* (`holdMs`) before `onBlow` fires.
 *  4. Every track is stopped in `stop()`, on unmount, and on success.
 */
export function useBlowDetection({ onBlow, holdMs = 700 }: Options) {
  const [state, setState] = useState<MicState>("idle");
  const [level, setLevel] = useState(0);
  const [threshold, setThreshold] = useState(0.16);

  /** The analysis loop reads this, not state, so calibration takes effect live. */
  const thresholdRef = useRef(0.16);

  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef(0);
  const firedRef = useRef(false);
  const holdStartRef = useRef<number | null>(null);
  const ambientRef = useRef<number[]>([]);
  const calibrateUntilRef = useRef(0);
  const activeRef = useRef(false);
  const onBlowRef = useRef(onBlow);

  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  const teardown = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    activeRef.current = false;
    holdStartRef.current = null;
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    const ctx = ctxRef.current;
    ctxRef.current = null;
    if (ctx && ctx.state !== "closed") void ctx.close().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    teardown();
    setLevel(0);
  }, [teardown]);

  useEffect(() => teardown, [teardown]);

  const start = useCallback(async () => {
    if (activeRef.current) return;
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setState("unsupported");
      return;
    }

    setState("requesting");
    firedRef.current = false;
    ambientRef.current = [];

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setState("denied");
      } else if (name === "NotFoundError" || name === "NotReadableError") {
        setState("error");
      } else {
        setState("unsupported");
      }
      return;
    }

    streamRef.current = stream;

    type AudioCtor = typeof AudioContext;
    const Ctor: AudioCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;

    if (!Ctor) {
      setState("unsupported");
      teardown();
      return;
    }

    const ctx = new Ctor();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume().catch(() => {});

    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.6;
    source.connect(analyser);

    const buf = new Float32Array(analyser.fftSize);
    calibrateUntilRef.current = performance.now() + 650;
    activeRef.current = true;
    setState("calibrating");

    const loop = () => {
      if (!activeRef.current) return;
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i += 1) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);

      const now = performance.now();

      if (now < calibrateUntilRef.current) {
        ambientRef.current.push(rms);
        setLevel(rms);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (ambientRef.current.length) {
        const sorted = [...ambientRef.current].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)] ?? 0.01;
        // Sit comfortably above the room, with a floor so quiet rooms still work.
        const next = Math.min(0.24, Math.max(0.055, median * 2.6 + 0.02));
        thresholdRef.current = next;
        setThreshold(next);
        setState("listening");
        ambientRef.current = [];
      }

      setLevel(rms);

      const active = thresholdRef.current;
      if (rms > active && !firedRef.current) {
        if (holdStartRef.current === null) holdStartRef.current = now;
        else if (now - holdStartRef.current >= holdMs) {
          firedRef.current = true;
          onBlowRef.current();
          teardown();
          setState("idle");
          setLevel(0);
          return;
        }
      } else if (rms <= active * 0.8) {
        holdStartRef.current = null;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [holdMs, teardown]);

  return { state, level, threshold, start, stop };
}
