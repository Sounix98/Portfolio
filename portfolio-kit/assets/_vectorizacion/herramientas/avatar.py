"""avatar-ilustracion: version a color (6 capas planas + clipPath circular) y version monocroma."""
import os, sys, json, re, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np, cv2
from PIL import Image
from scipy.ndimage import gaussian_filter
from svgpathtools import parse_path
import vec, build

A = build.A
K = 6
CROP = (250 + 912 - 10, 2130 + 30, 250 + 1082 + 34, 2130 + 236)
src_img = Image.open(os.path.join(A, build.FLYER)).convert("RGB").crop(CROP)
rgb = np.asarray(src_img, np.float32)
H0, W0 = rgb.shape[:2]

# 1. silueta (incluye sombra) y circulo ajustado al arco izquierdo, que es el borde real visible
cov = vec.field_dist(None or os.path.join(A, build.FLYER), CROP, gamma=1.6)
cs = vec.contours_of(vec.upsample(cov, 4, 0.8), 4, min_area=200)
main = max(cs, key=len)
pts32 = main.astype(np.float32)
for _ in range(3):  # ajuste robusto: descarta la parte de sombra / ruido y reajusta
    (cx, cy), (ew, eh), ang = cv2.fitEllipse(pts32)
    th = np.radians(ang)
    dx, dy = main[:, 0] - cx, main[:, 1] - cy
    u, v = dx * np.cos(th) + dy * np.sin(th), -dx * np.sin(th) + dy * np.cos(th)
    rad = np.sqrt((u / (ew / 2)) ** 2 + (v / (eh / 2)) ** 2)
    keep = np.abs(rad - 1) * min(ew, eh) / 2 < 1.5
    pts32 = main[keep].astype(np.float32)
if 45 < ang % 180 < 135:
    ew, eh, ang = eh, ew, ang - 90
ang = ((ang + 90) % 180) - 90
rx, ry = ew / 2, eh / 2
if abs(ang) < 2.5:
    ang = 0.0
th = np.radians(ang)
yy, xx = np.mgrid[0:H0, 0:W0]
dx, dy = xx + 0.5 - cx, yy + 0.5 - cy
u, v = dx * np.cos(th) + dy * np.sin(th), -dx * np.sin(th) + dy * np.cos(th)
inside = (np.sqrt((u / rx) ** 2 + (v / ry) ** 2) <= 1 - 0.6 / min(rx, ry)).astype(np.float32)
hw = np.hypot(rx * np.cos(th), ry * np.sin(th))
hh = np.hypot(rx * np.sin(th), ry * np.cos(th))
ox, oy = cx - hw, cy - hh
DW, DH = int(np.ceil(2 * hw)), int(np.ceil(2 * hh))
r = hw  # compat
print("elipse", round(cx, 1), round(cy, 1), round(rx, 2), round(ry, 2), round(ang, 2), "vb", DW, DH)

# 2. cuantizacion a K colores planos (Lab), etiquetas suavizadas
sm = cv2.bilateralFilter(rgb.astype(np.uint8), 7, 40, 5)
lab = cv2.cvtColor(sm, cv2.COLOR_RGB2LAB).astype(np.float32)
pts = lab[inside > 0.5]
crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 60, 0.5)
_, lbl, cen = cv2.kmeans(pts, K, None, crit, 6, cv2.KMEANS_PP_CENTERS)
full = np.full((H0, W0), -1, np.int32)
full[inside > 0.5] = lbl.ravel()
onehot = np.stack([gaussian_filter((full == i).astype(np.float32), 1.0) for i in range(K)])
full = np.where(inside > 0.5, onehot.argmax(0), -1)
cols = []
for i in range(K):
    m = full == i
    cols.append(rgb[m].mean(0))
area = [(full == i).sum() for i in range(K)]
order = sorted(range(K), key=lambda i: -area[i])
lum = [0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2] for c in cols]
hexs = ["#%02x%02x%02x" % tuple(int(round(v)) for v in c) for c in cols]


def path_for(mask_field, tol=0.4, sigma=0.6):
    ds, nn = [], 0
    for q in vec.contours_of(vec.upsample(mask_field, 4, sigma), 4, min_area=1.5):
        kind, data = vec.fit_contour(q, tol=tol, lmin=10, allow_ellipse=False)
        d, n = vec.contour_to_d(kind, data, ox, oy)
        ds.append(d)
        nn += n
    return "".join(ds), nn


ell = (f'<ellipse cx="{cx - ox:.2f}" cy="{cy - oy:.2f}" rx="{rx:.2f}" ry="{ry:.2f}"'
       + (f' transform="rotate({ang:.2f} {cx - ox:.2f} {cy - oy:.2f})"' if ang else "") + "/>")
# 3. version a color: base = capa mas grande a todo el circulo; resto encima, de mayor a menor
layers, nodes = [], 0
for i in order[1:]:
    d, n = path_for(onehot[i] * inside)
    layers.append(f'<path fill="{hexs[i]}" fill-rule="evenodd" d="{d}"/>')
    nodes += n
svg_c = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {DW} {DH}" role="img"><title>Avatar ilustración</title>'
         f'<clipPath id="c">{ell}</clipPath>'
         f'<g clip-path="url(#c)">{ell.replace("/>", f" fill=" + chr(34) + hexs[order[0]] + chr(34) + "/>")}'
         + "".join(layers) + "</g></svg>")
outdir = os.path.join(A, "flyers/logos/svg")
os.makedirs(outdir, exist_ok=True)
pc = os.path.join(outdir, "avatar-ilustracion.svg")
open(pc, "w", encoding="utf-8").write(svg_c)

# 4. fidelidad por capas: IoU por color contra las etiquetas de la fuente (dentro del circulo)
import resvg_py, io
png = resvg_py.svg_to_bytes(svg_string=svg_c, width=DW * 2, height=DH * 2)
ren = np.asarray(Image.open(io.BytesIO(bytes(png))).convert("RGB"), np.float32)
# etiquetas de la fuente a la misma rejilla (x2)
lab_src = cv2.warpAffine(full.astype(np.float32), np.float32([[2, 0, -ox * 2], [0, 2, -oy * 2]]), (DW * 2, DH * 2),
                         flags=cv2.INTER_NEAREST, borderValue=-1).astype(np.int32)
dists = np.stack([np.linalg.norm(ren - np.asarray(c, np.float32), axis=2) for c in cols])
lab_ren = dists.argmin(0)
ious = []
for i in range(K):
    a, bq = lab_src == i, (lab_ren == i) & (lab_src >= 0)
    ious.append(float((a & bq).sum() / max((a | bq).sum(), 1)))
valid = lab_src >= 0
acc = float((lab_ren[valid] == lab_src[valid]).mean())
mean_iou = float(np.mean(ious))
print("colores", hexs, "iou capas", [round(v, 3) for v in ious], "media", round(mean_iou, 4), "acc px", round(acc, 4))

# 5. version monocroma: circulo menos las capas oscuras (pelo, contornos, pupilas, fondo estelar)
dark = [i for i in range(K) if lum[i] < 105]
dmask = np.clip(sum(onehot[i] for i in dark), 0, 1) if dark else np.zeros((H0, W0), np.float32)
edge = np.sqrt((u / rx) ** 2 + (v / ry) ** 2)
band = ((edge <= 1 - 0.3 / min(rx, ry)) & (edge >= 1 - 2.6 / min(rx, ry))).astype(np.float32)  # aro exterior
mono_field = np.clip(np.maximum(inside * (1 - dmask), band), 0, 1)
dm, nm = path_for(mono_field, tol=0.35, sigma=0.5)
svg_m = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {DW} {DH}" role="img"><title>Avatar ilustración</title>'
         f'<path fill="currentColor" fill-rule="evenodd" d="{dm}"/></svg>')
pm = os.path.join(outdir, "avatar-ilustracion.mono.svg")
open(pm, "w", encoding="utf-8").write(svg_m)
SV = build.SVGO
for p in (pc, pm):
    subprocess.run([SV, "--config", build.SVGO_CFG, p, "-o", p], check=True, capture_output=True)
svg_m = open(pm, encoding="utf-8").read()
open(os.path.join(outdir, "avatar-ilustracion.mono.white.svg"), "w", encoding="utf-8").write(
    svg_m.replace('fill="currentColor"', 'fill="#ffffff"'))

# comparativa
Image.fromarray((np.clip(ren, 0, 255)).astype(np.uint8)).save(os.path.join(build.OUT, "comparativas", "avatar-ilustracion.png"))
sheet = Image.new("RGB", (DW * 2 * 3 + 20, DH * 2), (10, 10, 10))
orig = cv2.warpAffine(rgb, np.float32([[2, 0, -ox * 2], [0, 2, -oy * 2]]), (DW * 2, DH * 2), flags=cv2.INTER_CUBIC,
                      borderValue=(10, 10, 10))
sheet.paste(Image.fromarray(np.clip(orig, 0, 255).astype(np.uint8)), (0, 0))
sheet.paste(Image.fromarray(ren.astype(np.uint8)), (DW * 2 + 10, 0))
mono = np.zeros((DH * 2, DW * 2, 3), np.uint8)
mono[...] = 10
mm = vec.render_alpha(svg_m.replace('fill="currentColor"', 'fill="#ffffff"'), DW, DH, 2)
mono = (mono * (1 - mm[..., None]) + 255 * mm[..., None]).astype(np.uint8)
sheet.paste(Image.fromarray(mono), (DW * 4 + 20, 0))
sheet.save(os.path.join(build.OUT, "comparativas", "avatar-ilustracion_lado.png"))
res = dict(name="avatar-ilustracion", W=DW, H=DH, bytes=os.path.getsize(pc), nodes=nodes, iou_layers=round(mean_iou, 4),
           acc=round(acc, 4), colors=hexs, mono_bytes=os.path.getsize(pm), mono_nodes=nm, ellipse=[round(rx, 2), round(ry, 2), round(ang, 2)])
print(json.dumps(res))
