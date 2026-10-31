// The ground line, shared by the drawing and the animals on it.
export function horizonY(x: number) {
  return 656 + Math.sin(x / 120) * 7 - (x / 800) * 16 + Math.sin(x / 37) * 1.5;
}
