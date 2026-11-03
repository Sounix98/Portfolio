"""Vectorizador de siluetas: campo de cobertura -> contornos subpixel -> lineas + Bezier cubicas.

Pipeline: campo float 0..1 -> ampliar (bicubica) -> gaussiana -> marching squares (nivel .5)
-> remuestreo uniforme -> tramos rectos (ajuste de recta) / tramos curvos (Schneider)
-> esquinas vivas -> elipses/circulos exactos -> path SVG (evenodd).
"""
import math
import numpy as np
import cv2
from scipy.ndimage import gaussian_filter1d
from scipy.spatial import cKDTree
from skimage import measure
from PIL import Image
import resvg_py
import io

# ----------------------------------------------------------------- campos

def field_alpha(path, crop=None):
    im = Image.open(path).convert("RGBA")
    if crop:
        im = im.crop(crop)
    return np.asarray(im.split()[3], dtype=np.float32) / 255.0


def field_dark(path, crop=None, bg=None, fg=None, invert=False, gamma=1.0):
    """Cobertura = proximidad al color de tinta (fg) respecto al fondo (bg), en luminancia."""
    im = Image.open(path).convert("RGB")
    if crop:
        im = im.crop(crop)
    a = np.asarray(im, dtype=np.float32)
    lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    if gamma != 1.0:
        lum = 255.0 * (lum / 255.0) ** gamma
    if bg is None or fg is None:
        t, _ = cv2.threshold(lum.astype(np.uint8), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        hi, lo = lum[lum > t], lum[lum <= t]
        bg = float(np.median(hi)) if bg is None else bg
        fg = float(np.median(lo)) if fg is None else fg
        if invert:
            bg, fg = fg, bg
    cov = (bg - lum) / (bg - fg)
    return np.clip(cov, 0, 1).astype(np.float32)


def field_dist(path, crop=None, bg=None, gamma=2.2, T=None):
    """Cobertura = distancia RGB al fondo / T (cualquier color distinto del fondo cuenta como tinta)."""
    im = Image.open(path).convert("RGB")
    if crop:
        im = im.crop(crop)
    a = (np.asarray(im, dtype=np.float32) / 255.0) ** gamma
    if bg is None:
        border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
        bg = np.median(border, axis=0)
    d = np.linalg.norm(a - np.asarray(bg, dtype=np.float32), axis=2)
    if T is None:
        T = float(np.percentile(d, 99)) * 0.97
    return np.clip(d / T, 0, 1).astype(np.float32)


def field_seg(path, crop=None, c1=(255, 255, 255), c2=None, T=110.0):
    """Cobertura = distancia (RGB 0-255) al segmento c1-c2 de colores de fondo, / T."""
    im = Image.open(path).convert("RGB")
    if crop:
        im = im.crop(crop)
    a = np.asarray(im, dtype=np.float32)
    p0 = np.asarray(c1, np.float32)
    p1 = np.asarray(c2 if c2 is not None else c1, np.float32)
    v = p1 - p0
    den = max(float(v @ v), 1e-6)
    t = np.clip(((a - p0) @ v) / den, 0, 1)
    d = np.linalg.norm(a - (p0 + t[..., None] * v), axis=2)
    return np.clip(d / T, 0, 1).astype(np.float32)


def upsample(field, k, sigma):
    f = cv2.resize(field, None, fx=k, fy=k, interpolation=cv2.INTER_CUBIC)
    f = np.clip(f, 0, 1)
    if sigma > 0:
        f = cv2.GaussianBlur(f, (0, 0), sigma * k)
    return f


def contours_of(field, k, level=0.5, min_area=2.0):
    """Contornos cerrados en coordenadas continuas del campo original (pixel i cubre [i,i+1))."""
    pad = np.pad(field, 1)
    out = []
    for c in measure.find_contours(pad, level):
        if len(c) < 8 or np.linalg.norm(c[0] - c[-1]) > 1e-6:
            continue
        xy = np.stack([c[:, 1] - 1 + 0.5, c[:, 0] - 1 + 0.5], axis=1) / k
        x, y = xy[:-1, 0], xy[:-1, 1]
        area = 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))
        if area >= min_area:
            out.append(xy[:-1])
    return out


def bbox_of(cs):
    a = np.concatenate(cs)
    return a[:, 0].min(), a[:, 1].min(), a[:, 0].max(), a[:, 1].max()

# ----------------------------------------------------------------- utilidades geometricas

def resample_closed(P, step):
    Pc = np.vstack([P, P[:1]])
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(Pc, axis=0), axis=1))]
    L = d[-1]
    n = max(16, int(round(L / step)))
    s = np.linspace(0, L, n, endpoint=False)
    return np.stack([np.interp(s, d, Pc[:, 0]), np.interp(s, d, Pc[:, 1])], axis=1), L / n


def unit(v):
    n = np.linalg.norm(v)
    return v / n if n > 1e-12 else v


def arclen(P):
    return float(np.linalg.norm(np.diff(P, axis=0), axis=1).sum())


def fit_line(P):
    c = P.mean(axis=0)
    _, _, vt = np.linalg.svd(P - c, full_matrices=False)
    d = vt[0]
    return c, d


def snap_dir(d, tol_deg=0.8):
    ang = math.degrees(math.atan2(d[1], d[0])) % 180
    for target, v in ((0, (1, 0)), (180, (1, 0)), (90, (0, 1))):
        if abs(ang - target) < tol_deg:
            return np.array(v, float), True
    return d, False


def line_isect(c1, d1, c2, d2):
    A = np.array([d1, -d2]).T
    det = np.linalg.det(A)
    if abs(det) < 1e-6:
        return None
    t = np.linalg.solve(A, c2 - c1)[0]
    return c1 + t * d1


def proj_on_line(p, c, d):
    return c + np.dot(p - c, d) * d

# ----------------------------------------------------------------- Schneider

def _bez(c, t):
    t = np.asarray(t)[:, None]
    mt = 1 - t
    return mt**3 * c[0] + 3 * mt**2 * t * c[1] + 3 * mt * t**2 * c[2] + t**3 * c[3]


def _bez_d1(c, t):
    t = np.asarray(t)[:, None]
    mt = 1 - t
    return 3 * mt**2 * (c[1] - c[0]) + 6 * mt * t * (c[2] - c[1]) + 3 * t**2 * (c[3] - c[2])


def _bez_d2(c, t):
    t = np.asarray(t)[:, None]
    return 6 * (1 - t) * (c[2] - 2 * c[1] + c[0]) + 6 * t * (c[3] - 2 * c[2] + c[1])


def _chord_param(P):
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]
    return d / d[-1] if d[-1] > 0 else np.linspace(0, 1, len(P))


def _generate(P, u, t1, t2):
    p0, p3 = P[0], P[-1]
    b0 = (1 - u) ** 3
    b1 = 3 * u * (1 - u) ** 2
    b2 = 3 * u**2 * (1 - u)
    b3 = u**3
    A1 = b1[:, None] * t1
    A2 = b2[:, None] * t2
    C = np.array([[np.sum(A1 * A1), np.sum(A1 * A2)], [np.sum(A1 * A2), np.sum(A2 * A2)]])
    tmp = P - (b0 + b1)[:, None] * p0 - (b2 + b3)[:, None] * p3
    X = np.array([np.sum(A1 * tmp), np.sum(A2 * tmp)])
    det = C[0, 0] * C[1, 1] - C[0, 1] * C[1, 0]
    seg = np.linalg.norm(p3 - p0)
    a1 = a2 = None
    if abs(det) > 1e-12:
        a1 = (X[0] * C[1, 1] - X[1] * C[0, 1]) / det
        a2 = (C[0, 0] * X[1] - C[1, 0] * X[0]) / det
    eps = 1e-6 * seg
    if a1 is None or a1 < eps or a2 < eps or a1 > 4 * seg or a2 > 4 * seg:
        a1 = a2 = seg / 3
    return np.array([p0, p0 + t1 * a1, p3 + t2 * a2, p3])


def _reparam(c, P, u):
    d = _bez(c, u) - P
    d1 = _bez_d1(c, u)
    d2 = _bez_d2(c, u)
    num = np.sum(d * d1, axis=1)
    den = np.sum(d1 * d1, axis=1) + np.sum(d * d2, axis=1)
    with np.errstate(divide="ignore", invalid="ignore"):
        nu = np.where(np.abs(den) > 1e-12, u - num / den, u)
    return np.clip(nu, 0, 1)


def _max_err(c, P, u):
    d = np.linalg.norm(_bez(c, u) - P, axis=1)
    i = int(np.argmax(d[1:-1])) + 1 if len(P) > 2 else 0
    return d[i], i


def fit_cubic(P, t1, t2, tol, depth=0):
    n = len(P)
    if n == 2 or depth > 14:
        dist = np.linalg.norm(P[-1] - P[0]) / 3
        return [np.array([P[0], P[0] + t1 * dist, P[-1] + t2 * dist, P[-1]])]
    u = _chord_param(P)
    c = _generate(P, u, t1, t2)
    err, split = _max_err(c, P, u)
    if err < tol:
        return [c]
    if err < tol * 6:
        for _ in range(12):
            u = _reparam(c, P, u)
            c = _generate(P, u, t1, t2)
            err, split = _max_err(c, P, u)
            if err < tol:
                return [c]
    split = min(max(split, 1), n - 2)
    tc = unit(P[split - 1] - P[split + 1])
    return fit_cubic(P[: split + 1], t1, tc, tol, depth + 1) + fit_cubic(P[split:], -tc, t2, tol, depth + 1)


def end_tangent(P, at_start, reach=2.0):
    """Tangente unitaria apuntando hacia dentro del tramo, estimada a ~reach px del extremo."""
    Q = P if at_start else P[::-1]
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(Q, axis=0), axis=1))]
    j = int(np.searchsorted(d, reach))
    j = min(max(j, 1), len(Q) - 1)
    return unit(Q[j] - Q[0])

# ----------------------------------------------------------------- segmentacion

def straight_runs(P, step, tol, lmin, closed_rot=True):
    """Devuelve lista [(i,j)] de rangos inclusivos que son rectas (voraz)."""
    n = len(P)
    m = max(3, int(round(lmin / step)))
    runs = []
    i = 0
    while i < n - m:
        j = i + m
        if _dev(P, i, j) <= tol:
            while j + 1 < n and _dev(P, i, j + 1) <= tol:
                j += 1
            runs.append((i, j))
            i = j
        else:
            i += 1
    return runs


def _dev(P, i, j):
    a, b = P[i], P[j]
    d = b - a
    L = np.linalg.norm(d)
    if L < 1e-9:
        return 1e9
    seg = P[i:j + 1] - a
    return float(np.max(np.abs(seg[:, 0] * d[1] - seg[:, 1] * d[0])) / L)


def corner_indices(P, step, win_px=1.2, thr_deg=42):
    n = len(P)
    w = max(2, int(round(win_px / step)))
    if n < 2 * w + 3:
        return []
    v1 = P[w:-w] - P[: -2 * w]
    v2 = P[2 * w:] - P[w:-w]
    cr = v1[:, 0] * v2[:, 1] - v1[:, 1] * v2[:, 0]
    dt = np.sum(v1 * v2, axis=1)
    ang = np.abs(np.degrees(np.arctan2(cr, dt)))
    out = []
    i = 0
    while i < len(ang):
        if ang[i] >= thr_deg:
            j = i
            while j + 1 < len(ang) and ang[j + 1] >= thr_deg:
                j += 1
            seg = ang[i:j + 1]
            out.append(i + int(np.argmax(seg)) + w)
            i = j + 1
        else:
            i += 1
    return out

# ----------------------------------------------------------------- elipse

def try_ellipse(P, tol):
    if len(P) < 20:
        return None
    (cx, cy), (w, h), ang = cv2.fitEllipse(P.astype(np.float32))
    a, b = w / 2, h / 2
    if min(a, b) < 3:
        return None
    th = np.linspace(0, 2 * np.pi, 1440, endpoint=False)
    ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    ex = a * np.cos(th)
    ey = b * np.sin(th)
    poly = np.stack([cx + ex * ca - ey * sa, cy + ex * sa + ey * ca], axis=1)
    d, _ = cKDTree(poly).query(P)
    if d.max() > tol:
        return None
    return cx, cy, a, b, ang, float(d.max())

# ----------------------------------------------------------------- contorno -> segmentos

class Seg:
    __slots__ = ("kind", "pts")

    def __init__(self, kind, pts):
        self.kind = kind  # 'L' o 'C'
        self.pts = pts  # L: [p0,p1]; C: [p0,c1,c2,p1]


def fit_contour(C, step=0.4, tol=0.3, tol_line=0.22, lmin=12.0, corner_deg=42, ellipse_tol=0.35, smooth=0.6,
                allow_ellipse=True):
    """Devuelve ('ellipse', params) o ('path', [Seg...]) para un contorno cerrado."""
    P, step = resample_closed(C, step)
    if smooth > 0:
        P = np.stack([gaussian_filter1d(P[:, 0], smooth / step, mode="wrap"),
                      gaussian_filter1d(P[:, 1], smooth / step, mode="wrap")], axis=1)
    n = len(P)

    # elipse exacta si no hay esquinas
    cor = corner_indices(np.vstack([P, P[:12]]), step, thr_deg=corner_deg)
    cor = sorted({c % n for c in cor})
    if allow_ellipse and not cor:
        e = try_ellipse(P, ellipse_tol)
        if e:
            return "ellipse", e

    # rotar para empezar en una esquina, o en un punto no recto
    if cor:
        s0 = cor[0]
    else:
        runs0 = straight_runs(np.vstack([P, P[:5]]), step, tol_line, lmin)
        s0 = 0
        if runs0:
            s0 = runs0[0][1] % n
        # evitar empezar dentro de una recta: usar final de la primera recta
    P = np.roll(P, -s0, axis=0)
    cor = sorted({(c - s0) % n for c in cor})
    P = np.vstack([P, P[:1]])  # cerrado explicito
    N = len(P)

    # elementos: lista de dicts con rango [a,b] inclusive
    cut = sorted(set([0] + [c for c in cor if 0 < c < N - 1] + [N - 1]))
    pieces = [(cut[i], cut[i + 1]) for i in range(len(cut) - 1)]
    elems = []
    for a, b in pieces:
        sub = P[a:b + 1]
        runs = straight_runs(sub, step, tol_line, lmin)
        pos = 0
        for (i, j) in runs:
            if i > pos:
                elems.append(dict(t="C", a=a + pos, b=a + i))
            elems.append(dict(t="L", a=a + i, b=a + j))
            pos = j
        if pos < len(sub) - 1:
            elems.append(dict(t="C", a=a + pos, b=b))
        elif not runs:
            elems.append(dict(t="C", a=a, b=b))
    # esquinas internas de tramos curvos
    out = []
    for e in elems:
        if e["t"] == "C" and e["b"] - e["a"] > 12:
            sub = P[e["a"]:e["b"] + 1]
            ci = [c for c in corner_indices(sub, step, thr_deg=corner_deg) if 3 < c < len(sub) - 4]
            idx = [0] + ci + [len(sub) - 1]
            for u, v in zip(idx[:-1], idx[1:]):
                out.append(dict(t="C", a=e["a"] + u, b=e["a"] + v))
        else:
            out.append(e)
    elems = out

    # rectas: ajuste
    for e in elems:
        if e["t"] == "L":
            c, d = fit_line(P[e["a"]:e["b"] + 1])
            d, snapped = snap_dir(d)
            if snapped:
                c = np.array([P[e["a"]:e["b"] + 1, 0].mean(), P[e["a"]:e["b"] + 1, 1].mean()])
            # orientar en sentido del recorrido
            if np.dot(d, P[e["b"]] - P[e["a"]]) < 0:
                d = -d
            e["c"], e["d"] = c, d
    # curvas muy cortas entre dos rectas -> esquina viva
    changed = True
    while changed:
        changed = False
        m = len(elems)
        for i in range(m):
            e = elems[i]
            pr, nx = elems[(i - 1) % m], elems[(i + 1) % m]
            if e["t"] == "C" and pr["t"] == "L" and nx["t"] == "L" and m > 3:
                if arclen(P[e["a"]:e["b"] + 1]) < 3.2:
                    ang = abs(math.degrees(math.atan2(pr["d"][0] * nx["d"][1] - pr["d"][1] * nx["d"][0],
                                                       np.dot(pr["d"], nx["d"]))))
                    if ang > 20:
                        pr["b"] = e["a"]
                        nx["a"] = e["b"]
                        del elems[i]
                        changed = True
                        break
    # fusionar rectas consecutivas casi colineales
    m = len(elems)
    i = 0
    while i < len(elems) and len(elems) > 1:
        e, nx = elems[i], elems[(i + 1) % len(elems)]
        if e["t"] == "L" and nx["t"] == "L" and nx is not e:
            if abs(e["d"][0] * nx["d"][1] - e["d"][1] * nx["d"][0]) < math.sin(math.radians(2.0)):
                if nx["a"] == e["b"] and e["a"] < nx["b"]:
                    e["b"] = nx["b"]
                    cc, dd = fit_line(P[e["a"]:e["b"] + 1])
                    dd, sn = snap_dir(dd)
                    if np.dot(dd, P[e["b"]] - P[e["a"]]) < 0:
                        dd = -dd
                    e["c"], e["d"] = (np.array([P[e["a"]:e["b"] + 1, 0].mean(), P[e["a"]:e["b"] + 1, 1].mean()])
                                      if sn else cc), dd
                    del elems[(i + 1) % len(elems)]
                    continue
        i += 1

    m = len(elems)
    # uniones
    J = []
    for i in range(m):
        e, nx = elems[i], elems[(i + 1) % m]
        base = P[e["b"]]
        if e["t"] == "L" and nx["t"] == "L":
            q = line_isect(e["c"], e["d"], nx["c"], nx["d"])
            J.append(q if q is not None and np.linalg.norm(q - base) < 4 else base)
        elif e["t"] == "L":
            J.append(proj_on_line(base, e["c"], e["d"]))
        elif nx["t"] == "L":
            J.append(proj_on_line(base, nx["c"], nx["d"]))
        else:
            J.append(base)

    segs = []
    for i, e in enumerate(elems):
        p0, p1 = J[(i - 1) % m], J[i]
        if e["t"] == "L":
            segs.append(Seg("L", [p0, p1]))
            continue
        sub = P[e["a"]:e["b"] + 1].copy()
        sub[0], sub[-1] = p0, p1
        t1 = end_tangent(sub, True)
        t2 = end_tangent(sub, False)
        pr, nx = elems[(i - 1) % m], elems[(i + 1) % m]
        if pr["t"] == "L" and abs(pr["d"][0] * t1[1] - pr["d"][1] * t1[0]) < math.sin(math.radians(28)) \
                and np.dot(pr["d"], t1) > 0:
            t1 = pr["d"]
        if nx["t"] == "L" and abs(nx["d"][0] * t2[1] - nx["d"][1] * t2[0]) < math.sin(math.radians(28)) \
                and np.dot(-nx["d"], t2) > 0:
            t2 = -nx["d"]
        for c in fit_cubic(sub, t1, t2, tol):
            segs.append(Seg("C", list(c)))
    return "path", segs

# ----------------------------------------------------------------- serializacion

def f(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def contour_to_d(kind, data, ox=0.0, oy=0.0):
    if kind == "ellipse":
        cx, cy, a, b, ang, _ = data
        cx -= ox
        cy -= oy
        ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        x1, y1 = cx + a * ca, cy + a * sa
        x2, y2 = cx - a * ca, cy - a * sa
        if abs(a - b) < 0.6:
            r = (a + b) / 2
            return f"M{f(cx - r)} {f(cy)}a{f(r)} {f(r)} 0 1 0 {f(2 * r)} 0a{f(r)} {f(r)} 0 1 0 {f(-2 * r)} 0z", 2
        return (f"M{f(x1)} {f(y1)}A{f(a)} {f(b)} {f(ang)} 1 0 {f(x2)} {f(y2)}"
                f"A{f(a)} {f(b)} {f(ang)} 1 0 {f(x1)} {f(y1)}z"), 2
    segs = data
    off = np.array([ox, oy])
    p = segs[0].pts[0] - off
    d = [f"M{f(p[0])} {f(p[1])}"]
    cur = p
    nodes = 1
    for s in segs:
        pts = [q - off for q in s.pts]
        if s.kind == "L":
            q = pts[1]
            if abs(q[0] - cur[0]) < 0.005:
                d.append(f"V{f(q[1])}")
            elif abs(q[1] - cur[1]) < 0.005:
                d.append(f"H{f(q[0])}")
            else:
                d.append(f"L{f(q[0])} {f(q[1])}")
            cur = q
        else:
            d.append("C" + " ".join(f"{f(q[0])} {f(q[1])}" for q in pts[1:]))
            cur = pts[3]
        nodes += 1
    d.append("Z")
    return "".join(d), nodes - 1

# ----------------------------------------------------------------- render / metricas

def render_alpha(svg, w, h, scale=1):
    png = resvg_py.svg_to_bytes(svg_string=svg, width=w * scale, height=h * scale)
    im = Image.open(io.BytesIO(bytes(png))).convert("RGBA")
    return np.asarray(im.split()[3], dtype=np.float32) / 255.0


def soft_iou(a, b):
    return float(np.minimum(a, b).sum() / max(np.maximum(a, b).sum(), 1e-9))


def hard_iou(a, b):
    A, B = a > 0.5, b > 0.5
    return float((A & B).sum() / max((A | B).sum(), 1))


def diff_image(ref, svg, scale=2):
    r = cv2.resize(ref, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    s = cv2.resize(svg, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    img = np.zeros(r.shape + (3,), np.float32)
    img[..., 0] = np.clip(r, 0, 1)  # rojo = referencia
    img[..., 1] = np.clip(s, 0, 1)  # cian = SVG
    img[..., 2] = np.clip(s, 0, 1)
    return Image.fromarray((img * 255).astype(np.uint8))
