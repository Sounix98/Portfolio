// Convierte las imágenes del kit (../portfolio-kit/assets) a WebP en public/images
// y genera src/app/content/media.ts con las dimensiones de cada una.
//   npm run images
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Usa el kit incluido en el repo (portfolio-kit/); si no existe, el de la carpeta contigua.
const SRC = fs.existsSync('portfolio-kit/assets') ? path.resolve('portfolio-kit/assets') : path.resolve('../portfolio-kit/assets');
const OUT = path.resolve('public/images');
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
  entries[rel] = { w: info.width, h: info.height };
}

const sorted = Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(
  MANIFEST,
  `// Generado por scripts/optimize-images.mjs — no editar a mano.\nexport const media: Record<string, { w: number; h: number }> = ${JSON.stringify(sorted, null, 2)};\n`,
);
console.log(`${files.length} imágenes → public/images (WebP)`);
