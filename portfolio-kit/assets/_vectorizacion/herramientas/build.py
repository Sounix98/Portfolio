"""Construye un logo SVG a partir de una fuente y lo compara con la silueta de referencia.

Uso: python -I build.py ledco ovejero ...
"""
import os, sys, re, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from svgpathtools import parse_path
import vec

A = r"C:\Users\WAZE\Documents\PORTFOLIO SOUNIX\portfolio-kit\assets"
OUT = os.path.join(A, "_vectorizacion")
SVGO = os.path.join(os.environ["TEMP"], "svgo_t", "node_modules", ".bin", "svgo.cmd")
SVGO_CFG = os.path.join(OUT, "herramientas", "svgo.config.cjs")

def _p(*a):
    return os.path.join(A, *a)


def alpha(path, crop=None):
    return lambda: vec.field_alpha(_p(path), crop)


def dist(path, crop, zero=None, **kw):
    def f():
        a = vec.field_dist(_p(path), crop, **kw)
        if zero:
            a[zero[1]:zero[3], zero[0]:zero[2]] = 0
        return a
    return f


def dark(path, crop=None, zero=None, **kw):
    def f():
        a = vec.field_dark(_p(path), crop, **kw)
        if zero:
            a[zero[1]:zero[3], zero[0]:zero[2]] = 0
        return a
    return f


def seg(path, crop, sticker=False, **kw):
    def f():
        a = vec.field_seg(_p(path), crop, **kw)
        if sticker:  # descarta la sombra: solo lo que queda dentro del borde blanco del sticker
            import cv2
            im = np.asarray(Image.open(_p(path)).convert("RGB").crop(crop))
            white = (im.min(axis=2) > 225).astype(np.uint8)
            n, lab, st, _ = cv2.connectedComponentsWithStats(white, connectivity=8)
            ring = (lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)
            ff = ring.copy()
            h, w = ff.shape
            m = np.zeros((h + 2, w + 2), np.uint8)
            inv = 1 - ring
            cv2.floodFill(inv, m, (0, 0), 2)
            inside = (inv != 2).astype(np.uint8)
            a = a * cv2.erode(inside, np.ones((3, 3), np.uint8))
        return a
    return f


FLYER = "flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg"


def flyer(x0, x1, y0=0, y1=230, m=8):
    return (250 + x0 - m, 2130 + y0, 250 + x1 + m, 2130 + y1)


def L(title, ref, outdir, src, name, k=4, sigma=0.5, tol=0.35, lmin=12, good=True, **kw):
    return dict(title=title, ref=ref, outdir=outdir, src=src, source_name=name, k=k, sigma=sigma,
                fit=dict(tol=tol, lmin=lmin, **kw.pop("fit", {})), good=good, **kw)


LOGOS = {
    "ledco": L("LEDCO", "clientes/ledco.png", "clientes/svg", alpha("ledco/logos/ledco-logo-blanco.png"),
               "ledco/logos/ledco-logo-blanco.png", sigma=0.45, tol=0.28, lmin=14),
    "ovejero": L("Ovejero Uniformes", "clientes/ovejero.png", "clientes/svg",
                 dark("branding/ovejero-uniformes.jpg", (1250, 600, 1750, 1110), gamma=2.2),
                 "branding/ovejero-uniformes.jpg (recorte 1250,600-1750,1110)", tol=0.4),
    "zipo": L("Zipo", "clientes/zipo.png", "clientes/svg", alpha("zipo/zipo-logo-blanco.png"),
              "zipo/zipo-logo-blanco.png", sigma=0.5, tol=0.5, lmin=20, min_area=3.0),
    "ntac": L("NTAC", "clientes/ntac.png", "clientes/svg", alpha("ntac/ntac-logo-blanco.png"),
              "ntac/ntac-logo-blanco.png", sigma=0.9, tol=0.7, lmin=45, fit=dict(smooth=1.0, corner_deg=65), rel_area=0.0002),
    "vexbiz": L("VEXBIZ", "clientes/vexbiz.png", "clientes/svg",
                alpha("C:/Users/WAZE/Documents/VEXBIZ WIREFRAME/LOGO/VEXBIZ FONDO OSCUROEX.png", (0, 0, 1159, 440)),
                "VEXBIZ FONDO OSCUROEX.png (recorte y 0-440)", sigma=0.5, tol=0.3, lmin=14, native=True),
    "mercado-libre": L("Mercado Libre", "clientes/mercado-libre.png", "clientes/svg",
                       dark("mercadolibre-tucarro/tucarro-promo.jpg", (66, 588, 312, 668), invert=True),
                       "mercadolibre-tucarro/tucarro-promo.jpg (recorte 66,588-312,668)", sigma=0.6, tol=0.45, lmin=10,
                       good=False, native=True, scale=1.7),
    "tucarro": L("TuCarro", "clientes/tucarro.png", "clientes/svg",
                 dark("mercadolibre-tucarro/tucarro-promo.jpg", (350, 602, 552, 654), zero=(192, 42, 202, 52)),
                 "mercadolibre-tucarro/tucarro-promo.jpg (recorte 350,602-552,654)", sigma=1.0, tol=0.45, lmin=10,
                 good=False, native=True, scale=2.4, min_area=6.0),
    "dviajes": L("D'Viajes", "clientes/dviajes.png", "clientes/svg",
                 dark("cafe-marketing/dviajes-plan-bad-bunny-02-paquete.png", (325, 214, 535, 268), invert=True, gamma=2.2),
                 "cafe-marketing/dviajes-plan-bad-bunny-02-paquete.png (recorte 325,214-535,268)", sigma=0.9,
                 tol=0.4, lmin=10, good=False),
    "cafe-marketing": L("Café Marketing", "clientes/cafe-marketing.png", "clientes/svg",
                        dark("cafe-marketing/cafemkt-promo-04-agenda-tu-cita.png", (355, 650, 775, 1160), gamma=2.2, zero=(345, 0, 420, 350)),
                        "cafe-marketing/cafemkt-promo-04-agenda-tu-cita.png (recorte 355,650-775,1160)", sigma=0.7,
                        tol=0.35, lmin=14, native=True),
    "nanologic": L("Nanologic", "clientes/nanologic.png", "clientes/svg",
                   seg("cafe-marketing/nanologic-delivery-gratis.png", (200, 1000, 480, 1280),
                       c1=(255, 255, 255), c2=(255, 198, 60), T=120.0, sticker=True),
                   "cafe-marketing/nanologic-delivery-gratis.png (recorte 200,1000-480,1280)", sigma=0.9, tol=0.45,
                   lmin=10, good=False, native=True, rel_area=0.0006),
    "tai-studio": L("Tai Studio", None, "clientes/svg",
                    dark("branding/tai-studio.jpg", (760, 70, 1230, 390), gamma=2.2),
                    "branding/tai-studio.jpg (recorte 760,70-1230,390)", sigma=0.6, tol=0.25, lmin=10, native=True,
                    scale=0.5),
    "four-two": L("Four-Two Streetwear", None, "clientes/svg",
                  dark("branding/four-two-streetwear.jpg", (740, 95, 1260, 322), gamma=2.2),
                  "branding/four-two-streetwear.jpg (recorte 740,95-1260,322, solo el 42)", sigma=0.6, tol=0.25, lmin=10,
                  native=True, scale=0.5),
    "kryss-cakes": L("Kryss Cakes", None, "clientes/svg",
                     dark("branding/kryss-cakes.jpg", (735, 0, 1245, 510), gamma=1.0, bg=110.0, fg=35.0),
                     "branding/kryss-cakes.jpg (recorte 735,0-1245,510)", sigma=0.6, tol=0.25, lmin=10, native=True,
                     scale=0.4),
    "lecheria": L("Lechería", "flyers/logos/lecheria.png", "flyers/logos/svg",
                  dist(FLYER, flyer(45, 353), gamma=1.6), FLYER + " franja x45-353", sigma=0.6, tol=0.6, lmin=12, fit=dict(smooth=0.8), min_area=1.0, native=True, rel_area=0.001),
    "lacosta": L("Lacosta", "flyers/logos/lacosta.png", "flyers/logos/svg",
                 dist(FLYER, flyer(427, 810), gamma=1.6), FLYER + " franja x427-810", sigma=0.6, tol=0.35, lmin=10, native=True, rel_area=0.001),
    "conejo-mascara": L("Conejo con máscara", "flyers/logos/conejo-mascara.png", "flyers/logos/svg",
                        dist(FLYER, flyer(1188, 1300), gamma=1.6), FLYER + " franja x1188-1300", sigma=0.6, tol=0.35, lmin=8,
                        min_area=1.0, native=True, rel_area=0.001),
    "w": L("W", "flyers/logos/w.png", "flyers/logos/svg",
           dist(FLYER, flyer(1404, 1589), gamma=2.2), FLYER + " franja x1404-1589", sigma=0.35, tol=0.4, lmin=30, min_area=0.8, level=0.55, fit=dict(smooth=0.7), native=True, rel_area=0.00003),
    "capibara": L("Capibara Food Delivery", "flyers/logos/capibara.png", "flyers/logos/svg",
                  dist(FLYER, flyer(1660, 2022), gamma=1.6, zero=(318, 0, 400, 24)), FLYER + " franja x1660-2022", sigma=0.6, tol=0.35, lmin=8,
                  min_area=1.0, native=True, rel_area=0.001),
    "pesher": L("Pesher Barber Shop", "flyers/logos/pesher.png", "flyers/logos/svg",
                dist(FLYER, flyer(2060, 2356), gamma=1.6), FLYER + " franja x2060-2356", sigma=0.6, tol=0.35, lmin=10,
                min_area=1.0, native=True, rel_area=0.001),
}


def build(name, cfg=None):
    c = LOGOS[name]
    if cfg:
        c = {**c, **cfg}
    src = c["src"]()
    ref = vec.field_alpha(os.path.join(A, c["ref"])) if c["ref"] else src.copy()
    ys, xs = np.where(ref > 0.04)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    W, H = int(x1 - x0), int(y1 - y0)
    refc = ref[y0:y1, x0:x1]
    # bbox subpixel del borde 0.5 de la referencia (coordenadas de imagen completa)
    rb = vec.bbox_of(vec.contours_of(vec.upsample(ref, 4, 0.0), 4))

    cs = vec.contours_of(vec.upsample(src, c["k"], c["sigma"]), c["k"], level=c.get("level", 0.5), min_area=c.get("min_area", 2.0))
    ar = [0.5 * abs(np.dot(q[:, 0], np.roll(q[:, 1], -1)) - np.dot(q[:, 1], np.roll(q[:, 0], -1))) for q in cs]
    cs = [q for q, a in zip(cs, ar) if a >= c.get("rel_area", 0.0003) * max(ar)]
    sb = vec.bbox_of(cs)
    sx = (rb[2] - rb[0]) / (sb[2] - sb[0])
    sy = (rb[3] - rb[1]) / (sb[3] - sb[1])
    if c.get("native"):  # conserva las proporciones de la fuente; se compara contra la propia fuente
        sx = sy = float(c.get("scale", 1.0))
        bw, bh = (sb[2] - sb[0]) * sx, (sb[3] - sb[1]) * sx
        rb = (rb[0], rb[1], rb[0] + bw, rb[1] + bh)
        W, H = int(np.ceil(bw + 0.04)), int(np.ceil(bh + 0.04))
        cv = __import__("cv2")
        refc = cv.warpAffine(src, np.float32([[sx, 0, -sb[0] * sx], [0, sx, -sb[1] * sx]]), (W, H),
                             flags=cv.INTER_LINEAR)
        refc = np.clip(refc, 0, 1)
        x0, y0 = rb[0], rb[1]
    cs = [np.stack([(q[:, 0] - sb[0]) * sx + rb[0], (q[:, 1] - sb[1]) * sy + rb[1]], axis=1) for q in cs]

    ds, nodes = [], 0
    for q in cs:
        kind, data = vec.fit_contour(q, **c["fit"])
        d, n = vec.contour_to_d(kind, data, x0, y0)
        ds.append(d)
        nodes += n
    d = "".join(ds)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img">'
           f'<title>{c["title"]}</title><path fill="currentColor" fill-rule="evenodd" d="{d}"/></svg>')
    outdir = os.path.join(A, c["outdir"])
    os.makedirs(outdir, exist_ok=True)
    p = os.path.join(outdir, name + ".svg")
    open(p, "w", encoding="utf-8").write(svg)
    subprocess.run([SVGO, "--config", SVGO_CFG, p, "-o", p], check=True, capture_output=True)
    svg = open(p, encoding="utf-8").read()
    white = svg.replace('fill="currentColor"', 'fill="#ffffff"')
    open(os.path.join(outdir, name + ".white.svg"), "w", encoding="utf-8").write(white)

    ra = vec.render_alpha(white, W, H)
    iou_s, iou_h = vec.soft_iou(refc, ra), vec.hard_iou(refc, ra)
    os.makedirs(os.path.join(OUT, "comparativas"), exist_ok=True)
    vec.diff_image(refc, ra, 2).save(os.path.join(OUT, "comparativas", name + ".png"))
    m = re.search(r' d="([^"]+)"', svg)
    nseg = len(parse_path(m.group(1))) if m else 0
    # IoU contra la fuente (mismo SVG, devuelto al marco de la fuente), x2
    sh, sw = src.shape
    mat = f"matrix({1/sx:.6f} 0 0 {1/sy:.6f} {(x0 - rb[0]) / sx + sb[0]:.4f} {(y0 - rb[1]) / sy + sb[1]:.4f})"
    inner = re.search(r'<path[^>]*/>', white).group(0)
    svg_src = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {sw} {sh}"><g transform="{mat}">{inner}</g></svg>'
    ra2 = vec.render_alpha(svg_src, sw, sh, 2)
    srcup = np.clip(__import__("cv2").resize(src, None, fx=2, fy=2, interpolation=__import__("cv2").INTER_CUBIC), 0, 1)
    iou_src = vec.hard_iou(srcup, ra2)
    res = dict(iou_src=round(iou_src, 4), name=name, W=W, H=H, bytes=os.path.getsize(p), nodes=nseg, iou_soft=round(iou_s, 4),
               iou_hard=round(iou_h, 4), contours=len(cs), source=c["source_name"])
    return res


if __name__ == "__main__":
    out = []
    for n in sys.argv[1:]:
        r = build(n)
        print(json.dumps(r, ensure_ascii=False))
        out.append(r)
