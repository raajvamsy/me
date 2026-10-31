// The fox is hand-painted: sprite sheets at 8 frames per second.
const sheet = (src: string, cols: number, rows: number, scale = 1) => ({ src, cols, rows, scale });
export const SPRITES = {
  run: sheet("/art/fox/run.webp", 4, 2),
  jump: sheet("/art/fox/jump.webp", 4, 2),
  // Sheets were painted at different sizes. These match them on the size of the fox.
  roll: sheet("/art/fox/roll.webp", 4, 2, 0.75),
  heads: sheet("/art/fox/heads.webp", 3, 3),
  body: sheet("/art/fox/sit-body.webp", 1, 1),
};
export type SpriteName = keyof typeof SPRITES;
export type Images = Partial<Record<SpriteName, HTMLImageElement>>;

const FPS = 8;
// Sitting heads measure about 88 pixels nose to ear and running heads about 45, so 0.51 would match exactly.
// Set smaller by eye: a curled-up fox reads larger than one stretched out.
const SIT_SCALE = 0.4;
const ready = (image?: HTMLImageElement): image is HTMLImageElement => !!image?.complete && image.naturalWidth > 0;

// Draws one frame standing on (x, y). Width is measured in sheet pixels times scale.
function frame(c: CanvasRenderingContext2D, images: Images, name: SpriteName, index: number, x: number, y: number, scale: number, dir = 1) {
  const image = images[name];
  if (!ready(image)) return;
  const s = SPRITES[name];
  const cw = image.naturalWidth / s.cols;
  const ch = image.naturalHeight / s.rows;
  const k = scale * s.scale;
  c.save();
  c.translate(x, y);
  c.scale(dir, 1);
  c.drawImage(image, (index % s.cols) * cw, Math.floor(index / s.cols) * ch, cw, ch, (-cw * k) / 2, -ch * k, cw * k, ch * k);
  c.restore();
}

// Heads in sheet order: 0-5 turn from far left through the viewer (3) to far right,
// 6 looks up, 7 is eyes closed facing down, 8 is eyes closed facing right.
function headFor(yaw: number, pitch: number, blink: boolean) {
  if (blink) return yaw > 0.3 ? 8 : 7;
  if (pitch < -0.6 && yaw < 0.3) return 6;
  return yaw >= 0 ? 3 + Math.round(yaw * 2) : 3 + Math.round(yaw * 3);
}

// Sitting, looking wherever yaw and pitch say. Scale 1 is the sheet's own size; about 500 x 500 pixels.
export function drawSittingFox(c: CanvasRenderingContext2D, images: Images, x: number, y: number, scale: number, dir: number, yaw: number, pitch: number, blink: boolean) {
  frame(c, images, "body", 0, x, y, scale, dir);
  // The neck tuft overlaps the chest, near the front of the 500 x 384 body.
  frame(c, images, "heads", headFor(dir * yaw, pitch, blink), x + dir * 172 * scale, y - 275 * scale, scale * 0.98, dir);
}

export type Fox = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dir: number;
  phase: number;
  mode: "run" | "crouch" | "air" | "land" | "roll" | "sit";
  timer: number;
  escape: number;
  next: { height: number; speed: number };
};

export function newFox(x: number): Fox {
  return { x, y: 0, vx: 0, vy: 0, dir: -1, phase: 0, mode: "sit", timer: 0, escape: 0, next: { height: 0, speed: 0 } };
}

export type Pointer = { x: number; y: number; tapped: boolean } | null;

const ROLL_TIME = 1;

// How long the fox keeps running after the pointer has left its radius.
const SETTLE = 0.5;

// The fox sits still until the pointer or a tap comes inside its radius, then runs clear and sits again.
// The edges are walls. Width is the width the running sprite is drawn at.
export function stepFox(f: Fox, dt: number, w: number, width: number, p: Pointer) {
  const unit = width / 240;
  const wall = width * 0.5;
  const radius = width * 1.2;
  const inside = p !== null && Math.hypot(p.x - f.x, p.y - (f.y - width * 0.2)) < radius;
  const jump = (height: number, speed: number) => {
    f.mode = "crouch";
    f.timer = 0.12;
    f.next = { height, speed };
  };
  const roll = () => {
    f.mode = "roll";
    f.timer = ROLL_TIME;
  };
  // Trapped between the pointer and a wall: roll past the pointer, then keep going until clear.
  const away = p && p.x < f.x ? 1 : -1;
  const room = away > 0 ? w - wall - f.x : f.x - wall;
  const trapped = inside && room < width * 1.2;
  const canAct = f.mode === "run" || f.mode === "sit" || f.mode === "land";
  f.escape = Math.max(0, f.escape - dt);
  if (trapped && canAct && f.escape <= 0) {
    f.dir = -away;
    f.escape = 2;
    roll();
  } else if (inside && p?.tapped && canAct && f.escape <= 0) {
    f.dir = away;
    if (Math.random() < 0.5) jump(0.8, 340);
    else roll();
  }
  f.timer -= dt;
  if (f.mode === "sit") {
    f.vx *= 1 - Math.min(1, dt * 8);
    if (inside) {
      f.mode = "run";
      f.timer = SETTLE;
    }
  }
  if (f.mode === "run") {
    if (inside && p) {
      f.timer = SETTLE;
      if (f.escape <= 0) {
        f.dir = away;
        if (Math.random() < dt * 0.6) {
          if (Math.random() < 0.5) jump(0.5 + Math.random() * 0.4, 300);
          else roll();
        }
      }
    }
    f.vx = f.dir * (Math.abs(f.vx) + (340 * unit - Math.abs(f.vx)) * Math.min(1, dt * 5));
    if (f.mode === "run" && f.timer <= 0) f.mode = "sit";
  } else if (f.mode === "crouch") {
    f.vx *= 1 - Math.min(1, dt * 10);
    if (f.timer <= 0) {
      f.mode = "air";
      f.vy = -Math.sqrt(2 * 1500 * unit * f.next.height * width * 0.5);
      f.vx = f.dir * f.next.speed * unit;
    }
  } else if (f.mode === "air") {
    f.vy += 1500 * unit * dt;
    f.y += f.vy * dt;
    if (f.y >= 0 && f.vy > 0) {
      f.y = 0;
      f.vy = 0;
      f.mode = "land";
      f.timer = 0.25;
    }
  } else if (f.mode === "land" || f.mode === "roll") {
    if (f.mode === "roll") f.vx = f.dir * (f.escape > 0 ? 460 : 280) * unit;
    if (f.timer <= 0) {
      f.mode = "run";
      f.timer = SETTLE;
    }
  }
  f.x += f.vx * dt;
  if (f.x < wall) {
    f.x = wall;
    f.dir = 1;
    f.vx = Math.abs(f.vx);
  } else if (f.x > w - wall) {
    f.x = w - wall;
    f.dir = -1;
    f.vx = -Math.abs(f.vx);
  }
  f.phase += dt * FPS;
}

// Jump frames follow the height of the arc, so a jump of any size plays them all.
function jumpFrame(f: Fox) {
  if (f.mode === "crouch") return 0;
  if (f.mode === "land") return f.timer > 0.12 ? 6 : 7;
  if (f.vy < -350) return 1;
  if (f.vy < -120) return 2;
  if (f.vy < 120) return 3;
  return f.vy < 350 ? 4 : 5;
}

export function drawFox(c: CanvasRenderingContext2D, images: Images, f: Fox, ground: number, width: number, look: number, blink: boolean) {
  const run = images.run;
  if (!ready(run)) return;
  const scale = width / (run.naturalWidth / SPRITES.run.cols);
  const y = ground + f.y;
  if (f.mode === "sit") drawSittingFox(c, images, f.x, y, scale * SIT_SCALE, f.dir, look, 0, blink);
  else if (f.mode === "roll") frame(c, images, "roll", Math.min(7, Math.floor((1 - f.timer / ROLL_TIME) * 8)), f.x, y, scale, f.dir);
  else if (f.mode === "crouch" || f.mode === "air" || f.mode === "land") frame(c, images, "jump", jumpFrame(f), f.x, y, scale, f.dir);
  else frame(c, images, "run", Math.floor(f.phase) % 8, f.x, y, scale, f.dir);
}
