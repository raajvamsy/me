"use client";

import { useEffect, useRef, useState } from "react";

type Frame = {
  p: [number, number];
  n: number[];
  c: string;
  g: string;
  i: string | null;
  s: number;
  v: number;
  l: string[];
  e: { t: number; kind: string; text: string }[];
};
type Trace = { places: Record<string, [number, number]>; needs: string[]; frames: Frame[] };

const COLUMNS = 20;
const ROWS = 12;
const CLIPS = ["walk", "idle", "type", "drink", "sleep", "talk", "happy", "annoyed"];
const HEIGHT: Record<string, number> = { walk: 116, idle: 112, type: 92, drink: 116, sleep: 62, talk: 114, happy: 108, annoyed: 120 };
const AT_PLACE: Record<string, string> = { desk: "type", fridge: "drink", couch: "sleep", whiteboard: "talk", door: "idle" };
const SPEEDS = [1, 4, 12];

// Plays back one recorded life of the real Python simulation, since a static site can't run it live.
export function KabirReplay() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(4);
  const [playing, setPlaying] = useState(
    () => typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const cursor = useRef(0);

  useEffect(() => {
    fetch("/sim/kabir.json").then((response) => response.json()).then(setTrace);
  }, []);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!trace || !context || !canvas.current) return;
    const { width, height } = canvas.current;
    const sx = width / COLUMNS;
    const sy = height / ROWS;
    const sprites = Object.fromEntries(
      CLIPS.map((clip) => [
        clip,
        Array.from({ length: clip === "walk" ? 8 : 4 }, (_, i) => {
          const image = new Image();
          image.src = `/sim/sprites/${clip}_${i}.webp`;
          return image;
        }),
      ]),
    );
    const style = getComputedStyle(canvas.current);
    const ink = style.getPropertyValue("--ink").trim();
    const line = style.getPropertyValue("--line").trim();
    let frameId = 0;
    let previous = performance.now();
    let shown = trace.frames[0].p;
    let facing = 1;

    const draw = (now: number) => {
      if (playing) {
        cursor.current = (cursor.current + (Math.max(0, now - previous) / 1000) * speed) % trace.frames.length;
        setIndex(Math.floor(cursor.current));
      }
      previous = now;
      const frame = trace.frames[Math.floor(cursor.current)];

      context.clearRect(0, 0, width, height);
      context.strokeStyle = line;
      context.lineWidth = 1;
      for (let x = 0; x <= COLUMNS; x++) {
        context.beginPath();
        context.moveTo(x * sx, 0);
        context.lineTo(x * sx, height);
        context.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        context.beginPath();
        context.moveTo(0, y * sy);
        context.lineTo(width, y * sy);
        context.stroke();
      }
      context.font = "600 12px monospace";
      context.textAlign = "center";
      for (const [place, [x, y]] of Object.entries(trace.places)) {
        const w = (place === "whiteboard" ? 4 : 2.6) * sx;
        const h = 1.4 * sy;
        context.strokeStyle = ink;
        context.lineWidth = 2;
        context.strokeRect(x * sx - w / 2, y * sy - h / 2, w, h);
        context.fillStyle = ink;
        context.fillText(place.toUpperCase() + (place === "fridge" ? ` ×${frame.s}` : ""), x * sx, y * sy - h / 2 - 6);
      }
      if (frame.v) {
        const [x, y] = trace.places.door;
        context.beginPath();
        context.arc((x + 0.9) * sx, y * sy, 12, 0, 7);
        context.fill();
        context.fillText("visitor", x * sx, (y + 1.5) * sy);
      }

      const nextX = shown[0] + (frame.p[0] - shown[0]) * 0.25;
      if (Math.abs(nextX - shown[0]) > 0.005) facing = nextX > shown[0] ? 1 : -1;
      shown = [nextX, shown[1] + (frame.p[1] - shown[1]) * 0.25];
      const clip = frame.c === "walking" ? "walk" : frame.c === "door" && frame.v ? "talk" : (AT_PLACE[frame.c] ?? "idle");
      const frames = sprites[clip];
      const image = frames[Math.floor(now / (clip === "sleep" ? 450 : clip === "walk" ? 90 : 160)) % frames.length];
      const spriteHeight = HEIGHT[clip];
      const top = shown[1] * sy - spriteHeight + 18;
      if (image.complete && image.naturalWidth) {
        const spriteWidth = (spriteHeight * image.naturalWidth) / image.naturalHeight;
        context.save();
        context.translate(shown[0] * sx, 0);
        if (clip === "walk") context.scale(facing, 1);
        context.drawImage(image, -spriteWidth / 2, top, spriteWidth, spriteHeight);
        context.restore();
      }
      context.fillStyle = ink;
      context.fillText(frame.l.length ? `low ${frame.l.join(", ")}` : "Kabir", shown[0] * sx, shown[1] * sy + 34);
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [trace, playing, speed]);

  const frame = trace?.frames[index];
  const log = trace
    ? trace.frames.slice(0, index + 1).flatMap((item) => item.e).slice(-6).reverse()
    : [];

  return (
    <figure className="replay">
      <canvas ref={canvas} width={800} height={480} aria-label="Kabir moving around the office floor" />
      {frame && trace && (
        <>
          <div className="replay-needs">
            {trace.needs.map((need, i) => (
              <div key={need}>
                <span>
                  {need} <b>{frame.n[i].toFixed(2)}</b>
                </span>
                <i>
                  <em style={{ width: `${frame.n[i] * 100}%` }} />
                </i>
              </div>
            ))}
          </div>
          <div className="replay-controls">
            <button type="button" onClick={() => setPlaying(!playing)}>
              {playing ? "Pause" : "Play"}
            </button>
            {SPEEDS.map((value) => (
              <button type="button" key={value} aria-pressed={speed === value} onClick={() => setSpeed(value)}>
                {value}×
              </button>
            ))}
            <input
              type="range"
              aria-label="Minute of the recording"
              min={0}
              max={trace.frames.length - 1}
              value={index}
              onChange={(event) => {
                cursor.current = Number(event.target.value);
                setIndex(cursor.current);
              }}
            />
            <span>
              minute {index} · at {frame.c}
              {frame.i ? ` → ${frame.i}` : ""}
            </span>
          </div>
          <ol className="replay-log">
            {log.map((event, i) => (
              <li key={`${event.t}-${i}`}>{event.text}</li>
            ))}
          </ol>
        </>
      )}
      <figcaption>
        A recording, not live: one real run of the Python simulation with the language model off, played back here.
      </figcaption>
    </figure>
  );
}
