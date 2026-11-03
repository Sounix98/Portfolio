// Convierte las imágenes del kit (../portfolio-kit/assets) a WebP en public/images
// y genera src/app/content/media.ts con las dimensiones de cada una.
//   npm run images
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Usa el kit incluido en el repo (portfolio-kit/); si no existe, el de la carpeta contigua.
const SRC = fs.existsSync('portfolio-kit/assets') ? path.resolve('portfolio-kit/assets') : path.resolve('../portfolio-kit/assets');
const OUT = path.resolve('public/images');

// Paleta de 4 tonos (claro → oscuro) a partir de los colores dominantes de la imagen; se usa en el degradé de los heroes.
const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const hsv2rgb = (h, s, v) => {
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [f(5), f(3), f(1)];
};
async function tonesOf(file) {
  const { data } = await sharp(file).resize(48, 48, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bins = Array.from({ length: 24 }, () => ({ w: 0, s: 0 }));
  let sumS = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    const s = mx ? d / mx : 0;
    sumS += s;
    n++;
    if (d < 0.05 || mx < 0.15) continue;
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    const w = s * mx;
    const bi = Math.floor(h / 15) % 24;
    bins[bi].w += w;
    bins[bi].s += s * w;
  }
  if (sumS / n < 0.12) return ['#e6e6e6', '#a3a3a3', '#555555', '#1c1c1c']; // imagen casi monocroma
  // suavizar el histograma de tono (±1 bin) y tomar el pico
  const sm = bins.map((_, i) => bins[(i + 23) % 24].w * 0.5 + bins[i].w + bins[(i + 1) % 24].w * 0.5);
  const p1 = sm.indexOf(Math.max(...sm));
  let p2 = -1, best = 0;
  sm.forEach((v, i) => {
    const dist = Math.min((i - p1 + 24) % 24, (p1 - i + 24) % 24);
    if (dist >= 3 && v > best) { best = v; p2 = i; }
  });
  const h1 = p1 * 15 + 7.5;
  const h2 = p2 >= 0 && best > sm[p1] * 0.35 ? p2 * 15 + 7.5 : (h1 + 32) % 360;
  const mixH = (a, b, t) => { const d = ((b - a + 540) % 360) - 180; return (a + d * t + 360) % 360; };
  return [
    hex(...hsv2rgb(h1, 0.85, 1)),
    hex(...hsv2rgb(mixH(h1, h2, 0.5), 0.9, 0.9)),
    hex(...hsv2rgb(h2, 0.88, 0.62)),
    hex(...hsv2rgb(h2, 0.85, 0.3)),
  ];
}
const MANIFEST = path.resolve('src/app/content/media.ts');
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 2000;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).filter((e) => !e.name.startsWith('_')).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

// Los logos de clientes y aliados ahora son SVG (public/images/logos): sus PNG quedan solo como fuente.
const SKIP = ['clientes/', 'flyers/logos/'];
const files = walk(SRC)
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  .filter((f) => !SKIP.some((d) => path.relative(SRC, f).split(path.sep).join('/').startsWith(d)));
const entries = {};

if (fs.existsSync(OUT)) walk(OUT).filter((f) => f.endsWith('.webp')).forEach((f) => fs.rmSync(f));
for (const file of files) {
  const rel = path.relative(SRC, file).replace(/\\/g, '/').replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-');
  const out = path.join(OUT, rel + '.webp');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const info = await sharp(file)
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  entries[rel] = { w: info.width, h: info.height, tone: await tonesOf(file) };
}

const sorted = Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(
  MANIFEST,
  `// Generado por scripts/optimize-images.mjs — no editar a mano.\nexport const media: Record<string, { w: number; h: number; tone?: string[] }> = ${JSON.stringify(sorted, null, 2)};\n`,
);
console.log(`${files.length} imágenes → public/images (WebP)`);
