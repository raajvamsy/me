import { FooterFox, HeroLife } from "@/components/ink-life";
import { horizonY } from "@/components/ink-path";

// Ink drawings made of seeded strokes, so each render draws the same picture.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const n = (v: number) => Math.round(v * 10) / 10;

function hatching(seed: number) {
  const rand = seeded(seed);
  let d = "";
  for (let i = 0; i < 90; i++) {
    const x = rand() * 800;
    const y = 660 + rand() * 135;
    const l = 8 + rand() * 24;
    d += `M${n(x)} ${n(y)}l${n(l)} ${n(-l * 0.28)}`;
  }
  return d;
}

export function InkScene() {
  const hatch = hatching(5);
  const ground = Array.from({ length: 41 }, (_, i) => `${i * 20} ${n(horizonY(i * 20))}`).join("L");
  return (
    <div className="ink-scene" aria-hidden="true">
      <div className="ink-wash" />
      <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMax meet" className="ink-drawing">
        <g filter="url(#ink-rough)">
          <path d={`M${ground}V800H0Z`} fill="var(--bg)" stroke="none" />
          <path d={hatch} fill="none" stroke="var(--muted)" strokeWidth="1.3" strokeLinecap="round" opacity=".7" />
          <path d={`M${ground}`} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
      <HeroLife />
    </div>
  );
}

// A range of mountains drawn in one continuous line, with a fox that runs from the pointer.
export function InkRidge() {
  const rand = seeded(31);
  const ridge = (base: number, amp: number) => {
    let d = `M0 ${base}`;
    let y = base;
    for (let x = 30; x <= 1600; x += 30) {
      const swell = Math.sin(x / 210) * Math.sin(x / 83 + 1) * amp;
      y += (base - swell - y) * 0.55 + (rand() - 0.5) * amp * 0.26;
      d += `L${x} ${n(y)}`;
    }
    return d;
  };
  let hatch = "";
  for (let i = 0; i < 120; i++) {
    const x = rand() * 1600;
    const y = 165 + rand() * 60;
    const l = 5 + rand() * 18;
    hatch += `M${n(x)} ${n(y)}l${n(-l * 0.45)} ${n(l)}`;
  }
  return (
    <div className="ink-duel" aria-hidden="true">
    <svg className="ink-ridge" viewBox="0 0 1600 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g filter="url(#ink-rough)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={ridge(122, 66)} stroke="var(--line)" strokeWidth="2" />
        <path d={ridge(170, 44)} stroke="var(--muted)" strokeWidth="2.4" />
        <path d={hatch} stroke="var(--line)" strokeWidth="1.3" />
        <path d="M0 228C400 227 1100 229 1600 228" stroke="var(--ink)" strokeWidth="2.6" />
      </g>
    </svg>
    <FooterFox />
    </div>
  );
}

export function InkFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id="ink-rough" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="4" />
      </filter>
    </svg>
  );
}

export function Seal() {
  return (
    <span className="seal" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M5 4h4l3.4 12L16 4h3.4L14 20.5h-4Z" fill="var(--bg)" />
      </svg>
    </span>
  );
}
