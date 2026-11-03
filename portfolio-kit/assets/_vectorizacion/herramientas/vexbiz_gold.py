"""vexbiz.gold.svg: mismo wordmark con la X en dorado muestreado del original (resto en currentColor)."""
import os, sys, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np, cv2
from PIL import Image
import vec, build

c = build.LOGOS["vexbiz"]
P = r"C:/Users/WAZE/Documents/VEXBIZ WIREFRAME/LOGO/VEXBIZ FONDO OSCUROEX.png"
im = Image.open(P).convert("RGBA").crop((0, 0, 1159, 440))
rgba = np.asarray(im)
src = c["src"]()
cs = vec.contours_of(vec.upsample(src, c["k"], c["sigma"]), c["k"])
ar = [0.5 * abs(np.dot(q[:, 0], np.roll(q[:, 1], -1)) - np.dot(q[:, 1], np.roll(q[:, 0], -1))) for q in cs]
cs = [q for q, a in zip(cs, ar) if a >= 0.004 * max(ar)]
sb = vec.bbox_of(cs)
gold, white, gold_px = [], [], []
W, H = int(np.ceil(sb[2] - sb[0] + 0.04)), int(np.ceil(sb[3] - sb[1] + 0.04))
for q in cs:
    m = np.zeros(src.shape, np.uint8)
    cv2.fillPoly(m, [np.round(q - 0.0).astype(np.int32)], 1)
    ink = (m > 0) & (rgba[..., 3] > 250)
    col = rgba[..., :3][ink]
    is_gold = (col[:, 0].astype(int) - col[:, 2].astype(int)).mean() > 60
    kind, data = vec.fit_contour(np.stack([q[:, 0] - sb[0], q[:, 1] - sb[1]], 1), **c["fit"])
    d, _ = vec.contour_to_d(kind, data)
    (gold if is_gold else white).append(d)
    if is_gold:
        gold_px.append(col)
gc = np.concatenate(gold_px).mean(0)
hexc = "#%02X%02X%02X" % tuple(int(round(v)) for v in gc)
print("dorado muestreado", hexc, "contornos dorados", len(gold), "resto", len(white))
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img"><title>VEXBIZ</title>'
       f'<path fill="currentColor" fill-rule="evenodd" d="{"".join(white)}"/>'
       f'<path fill="{hexc}" d="{"".join(gold)}"/></svg>')
out = os.path.join(build.A, "clientes/svg", "vexbiz.gold.svg")
open(out, "w", encoding="utf-8").write(svg)
subprocess.run([build.SVGO, "--config", build.SVGO_CFG, out, "-o", out], check=True, capture_output=True)
w = open(out, encoding="utf-8").read()
open(os.path.join(build.A, "clientes/svg", "vexbiz.gold.white.svg"), "w", encoding="utf-8").write(
    w.replace('fill="currentColor"', 'fill="#ffffff"'))
print(os.path.getsize(out), "bytes", W, H)
