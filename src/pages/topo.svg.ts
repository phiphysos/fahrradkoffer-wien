import type { APIRoute } from 'astro';

/**
 * Dekorative Höhenlinien als eigene, cachebare SVG-Datei (hält das HTML schlank).
 * Deterministisch beim Build erzeugt.
 */
const W = 1600;
const H = 1120;

const centers = [
  { x: W * 0.18, y: H * 0.22, rings: 9, step: 46, seed: 1.3 },
  { x: W * 0.86, y: H * 0.84, rings: 11, step: 52, seed: 4.1 },
  { x: W * 0.62, y: H * 0.08, rings: 6, step: 40, seed: 2.7 },
];

const f = (n: number) => n.toFixed(1).replace(/\.0$/, '');

function ring(cx: number, cy: number, r: number, seed: number): string {
  const n = 40;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const k = 1 + 0.09 * Math.sin(3 * t + seed) + 0.05 * Math.sin(5 * t + seed * 1.7) + 0.025 * Math.sin(8 * t + seed * 2.9);
    pts.push([cx + Math.cos(t) * r * k * 1.25, cy + Math.sin(t) * r * k]);
  }
  // Catmull-Rom → kubische Bézierkurven
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

export const GET: APIRoute = () => {
  const paths = centers
    .flatMap((c) => Array.from({ length: c.rings }, (_, i) => ring(c.x, c.y, 30 + i * c.step, c.seed + i * 0.22)))
    .map((d) => `<path d="${d}"/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#EEF0EA" stroke-width="1.6">${paths}</g></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
