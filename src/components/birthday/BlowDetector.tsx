"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useBlowDetection } from "@/hooks/useBlowDetection";

/**
 * The microphone half of scene D. Mounted separately so the audio graph is
 * created (and torn down) purely by this component's lifetime.
 */
export function BlowDetector({
  onBlow,
  onDismiss,
  onDenied,
}: {
  onBlow: () => void;
  onDismiss: () => void;
  /** Fires if the browser refuses the mic, so the scene can surface the hold button. */
  onDenied?: () => void;
}) {
  const { state, level, threshold, start, stop } = useBlowDetection({ onBlow });

  const listening = state === "listening";
  const calibrating = state === "calibrating";
  const busy = state === "requesting" || calibrating || listening;
  const refused = state === "denied" || state === "unsupported" || state === "error";

  const onDeniedRef = useRef(onDenied);
  useEffect(() => {
    onDeniedRef.current = onDenied;
  }, [onDenied]);

  useEffect(() => {
    if (refused) onDeniedRef.current?.();
  }, [refused]);

  const message = (() => {
    switch (state) {
      case "idle":
        return "Tap once and the microphone listens for a puff.";
      case "requesting":
        return "Waiting for your browser to ask…";
      case "calibrating":
        return "Listening to the room for a moment…";
      case "listening":
        return "Go on — blow at the candles.";
      case "denied":
        return "No microphone, no problem — hold the button below instead.";
      case "unsupported":
        return "This browser has no microphone access. Hold the button below.";
      default:
        return "Something got tangled. The button below still works.";
    }
  })();

  const fill = Math.min(1, level / Math.max(threshold, 0.001));

  return (
    <div
      className="mt-6 rounded-2xl border p-4 text-center"
      style={{
        borderColor: "rgba(118,91,88,0.16)",
        background: "rgba(255,250,242,0.85)",
      }}
    >
      <p className="text-sm text-[var(--ink-soft)]" role="status" aria-live="polite">
        {message}
      </p>

      {listening ? (
        <div className="mt-3">
          <div
            className="h-2.5 w-full overflow-hidden rounded-full"
            style={{ background: "rgba(118,91,88,0.12)" }}
            aria-hidden
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#b9cbaa" }}
              animate={{ width: `${fill * 100}%` }}
              transition={{ duration: 0.12 }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--ink-soft)]">
            keep it going for a second
          </p>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {busy ? (
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              stop();
              onDismiss();
            }}
          >
            {state === "requesting" ? "Cancel" : "Stop listening"}
          </button>
        ) : refused ? (
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => void start()}
          >
            Try the microphone again
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => void start()}>
            Start listening
          </button>
        )}
      </div>
    </div>
  );
}
