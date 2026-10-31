"use client";

/* eslint-disable react-hooks/immutability -- frames mutate live animation state held in refs */

import { useEffect, useRef } from "react";
import { type Fox, type Images, type Pointer, SPRITES, type SpriteName, drawFox, drawSittingFox, newFox, stepFox } from "@/components/ink-fox";
import { horizonY } from "@/components/ink-path";


type Drop = { x: number; y: number; l: number; v: number; stop: number };
type Splash = { x: number; y: number; age: number };

function makeRain(count: number) {
  const drops: Drop[] = [];
  const splashes: Splash[] = [];
  const reset = (d: Drop, w: number, h: number, ground: (x: number) => number, top: boolean) => {
    d.x = Math.random() * w * 1.2;
    d.y = top ? -20 - Math.random() * h * 0.3 : Math.random() * h;
    d.v = 560 + Math.random() * 420;
    d.l = 9 + Math.random() * 15;
    d.stop = ground(d.x) + Math.random() * 18;
  };
  return (c: CanvasRenderingContext2D, dt: number, w: number, h: number, ground: (x: number) => number) => {
    while (drops.length < count) {
      const d = { x: 0, y: 0, l: 0, v: 0, stop: 0 };
      reset(d, w, h, ground, false);
      drops.push(d);
    }
    c.lineCap = "round";
    c.lineWidth = 1.1;
    for (const d of drops) {
      d.y += d.v * dt;
      d.x -= d.v * dt * 0.2;
      if (d.y >= d.stop) {
        if (splashes.length < 50) splashes.push({ x: d.x, y: d.stop, age: 0 });
        reset(d, w, h, ground, true);
      }
      c.strokeStyle = "rgba(243,240,232,.42)";
      c.beginPath();
      c.moveTo(d.x, d.y);
      c.lineTo(d.x + d.l * 0.2, d.y - d.l);
      c.stroke();
    }
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.age += dt;
      if (s.age > 0.26) {
        splashes.splice(i, 1);
        continue;
      }
      const k = s.age / 0.26;
      c.strokeStyle = `rgba(243,240,232,${0.5 * (1 - k)})`;
      c.beginPath();
      c.ellipse(s.x, s.y, 1.5 + k * 7, 0.6 + k * 1.9, 0, 0, 7);
      c.stroke();
    }
  };
}

function useCanvas(
  frame: (c: CanvasRenderingContext2D, w: number, h: number, dt: number, t: number, box: DOMRect, still: boolean) => void,
  onEnter?: () => void,
) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c = el.getContext("2d");
    if (!c) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let last = 0;
    let t = 0;
    let running = false;
    const size = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      el.width = w * dpr;
      el.height = h * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const paint = (dt: number) => {
      c.clearRect(0, 0, w, h);
      frame(c, w, h, dt, t, el.getBoundingClientRect(), still);
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      t += dt;
      paint(dt);
      if (running) raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(() => {
      size();
      if (still) paint(0);
    });
    ro.observe(el);
    size();
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        onEnter?.();
        if (onEnter) t = 0;
        if (still) {
          t = 30;
          paint(0);
          return;
        }
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
    // The frame function owns its own state and never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

const LEAF_TONES = ["#f3f0e8", "#0d0d0b", "#9c3212"];
type Leaf = { x: number; y: number; v: number; p: number; tone: string; end: number; fade: number };

function useSprites(names: SpriteName[]) {
  const images = useRef<Images>({});
  useEffect(() => {
    for (const name of names) {
      const image = new Image();
      image.src = SPRITES[name].src;
      images.current[name] = image;
    }
    // The list of sprites is fixed for each scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return images;
}

// The latest pointer position over the whole window; a tap counts once.
function usePointer() {
  const state = useRef<{ x: number; y: number; seen: boolean; tap: boolean }>({ x: 0, y: 0, seen: false, tap: false });
  useEffect(() => {
    const hover = matchMedia("(hover: hover)").matches;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      Object.assign(state.current, { x: e.clientX, y: e.clientY, seen: true });
    };
    const down = (e: PointerEvent) => {
      Object.assign(state.current, { x: e.clientX, y: e.clientY, seen: hover, tap: true });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
    };
  }, []);
  return state;
}

function drawTree(c: CanvasRenderingContext2D, image: HTMLImageElement | null, ox: number, oy: number, s: number) {
  if (!image?.complete || !image.naturalWidth) return;
  // The trunk meets the ground about 565, 1300 in the 1122 x 1402 painting.
  const k = s * 0.486;
  c.drawImage(image, ox + 500 * s - 565 * k, oy + 662 * s - 1300 * k, image.naturalWidth * k, image.naturalHeight * k);
}

export function HeroLife() {
  const rain = useRef(makeRain(90));
  const leaves = useRef<Leaf[]>([]);
  const pointer = usePointer();
  const images = useSprites(["body", "heads"]);
  const tree = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    tree.current = new Image();
    tree.current.src = "/art/tree.webp";
  }, []);
  const look = useRef({ yaw: 0, pitch: 0 });
  const ref = useCanvas((c, w, h, dt, t, box) => {
    const s = Math.min(w, h) / 800;
    const ox = (w - 800 * s) / 2;
    const oy = h - 800 * s;
    drawTree(c, tree.current, ox, oy, s);
    // Leaves drop from the canopy, drift down and fade out where they land.
    if (leaves.current.length < 14 && Math.random() < dt * 1.6) {
      const x = 250 + Math.random() * 510;
      leaves.current.push({ x, y: 90 + Math.random() * 300, v: 38 + Math.random() * 34, p: Math.random() * 6, tone: LEAF_TONES[Math.floor(Math.random() * 3)], end: horizonY(x) + Math.random() * 110, fade: 1 });
    }
    leaves.current = leaves.current.filter((l) => l.fade > 0);
    for (const l of leaves.current) {
      if (l.y < l.end) {
        l.y += l.v * dt;
        l.p += dt * 2.4;
        l.x += (Math.sin(l.p) * 34 - 9) * dt;
      } else l.fade -= dt / 1.2;
      const size = 7 * s + 1.5;
      const turn = l.y < l.end ? Math.sin(l.p) * 1.1 + 0.4 : 0.2;
      const dx = Math.cos(turn) * size;
      const dy = Math.sin(turn) * size;
      const px = ox + l.x * s;
      const py = oy + l.y * s;
      c.globalAlpha = Math.max(0, l.fade);
      c.fillStyle = l.tone;
      c.beginPath();
      c.moveTo(px - dx, py - dy);
      c.quadraticCurveTo(px - dy * 0.6, py + dx * 0.6, px + dx, py + dy);
      c.quadraticCurveTo(px + dy * 0.6, py - dx * 0.6, px - dx, py - dy);
      c.fill();
    }
    c.globalAlpha = 1;
    // The fox sits under the tree. With a mouse it watches the mouse; on a phone it watches you.
    const fx = ox + 390 * s;
    const fy = oy + 785 * s;
    const scale = 0.24 * s;
    const size = 145 * s;
    let yaw = 0;
    let pitch = 0;
    if (pointer.current.seen) {
      const dx = pointer.current.x - box.left - fx;
      const dy = pointer.current.y - box.top - (fy - size * 0.8);
      yaw = Math.max(-1, Math.min(1, dx / 280));
      pitch = Math.max(-0.7, Math.min(0.7, dy / 320));
    }
    const k = Math.min(1, dt * 7);
    look.current.yaw += (yaw - look.current.yaw) * k;
    look.current.pitch += (pitch - look.current.pitch) * k;
    drawSittingFox(c, images.current, fx, fy, scale, 1, look.current.yaw, look.current.pitch, Math.sin(t * 1.3) > 0.992);
    rain.current(c, dt, w, h, (x) => oy + horizonY(Math.max(0, Math.min(800, (x - ox) / s))) * s + Math.random() * 90 * s);
  });
  return <canvas ref={ref} className="ink-canvas" aria-hidden="true" />;
}

export function FooterFox() {
  const rain = useRef(makeRain(60));
  const pointer = usePointer();
  const fox = useRef<Fox | null>(null);
  const images = useSprites(["run", "jump", "roll", "body", "heads"]);
  const ref = useCanvas(
    (c, w, h, dt, t, box, still) => {
      const scale = Math.max(w / 1600, h / 240);
      const ground = h - 12 * scale;
      const width = Math.min(w * 0.31, h * 0.63, 185);
      if (!fox.current) fox.current = newFox(w * 0.62);
      const p = pointer.current;
      let target: Pointer = null;
      if (p.seen || p.tap) {
        const y = p.y - box.top;
        // The fox measures height from the ground, so the pointer must too.
        if (y > -60 && y < h + 60) target = { x: p.x - box.left, y: y - ground, tapped: p.tap };
      }
      p.tap = false;
      if (!still) stepFox(fox.current, dt, w, width, target);
      const look = target ? Math.max(-1, Math.min(1, (target.x - fox.current.x) / 240)) : 0;
      drawFox(c, images.current, fox.current, ground, width, look, Math.sin(t * 1.3) > 0.992);
      rain.current(c, dt, w, h, () => ground);
    },
    () => undefined,
  );
  return <canvas ref={ref} className="ink-canvas" aria-hidden="true" />;
}
