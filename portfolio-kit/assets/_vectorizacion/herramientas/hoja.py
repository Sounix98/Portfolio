"""Hoja de contacto: los 19 logos en blanco sobre #0a0a0a (+ fila a 22 px de alto)."""
import os, sys, io, re; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import resvg_py
from PIL import Image, ImageDraw
import build
A = build.A
ITEMS = [("ledco", "clientes"), ("mercado-libre", "clientes"), ("zipo", "clientes"), ("tucarro", "clientes"),
         ("ntac", "clientes"), ("nanologic", "clientes"), ("dviajes", "clientes"), ("cafe-marketing", "clientes"),
         ("ovejero", "clientes"), ("vexbiz", "clientes"), ("tai-studio", "clientes"), ("four-two", "clientes"), ("kryss-cakes", "clientes"), ("lecheria", "flyers/logos"), ("lacosta", "flyers/logos"),
         ("avatar-ilustracion.mono", "flyers/logos"), ("conejo-mascara", "flyers/logos"), ("w", "flyers/logos"),
         ("capibara", "flyers/logos"), ("pesher", "flyers/logos")]
CW, CH, COLS = 380, 220, 4
rows = (len(ITEMS) + COLS - 1) // COLS
sheet = Image.new("RGB", (CW * COLS, CH * rows), (10, 10, 10))
d = ImageDraw.Draw(sheet)

def render(svg, h):
    W, H = map(float, re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg).groups())
    w = max(1, round(W * h / H))
    im = Image.open(io.BytesIO(bytes(resvg_py.svg_to_bytes(svg_string=svg, width=w, height=h)))).convert("RGBA")
    return im

for i, (n, base) in enumerate(ITEMS):
    svg = open(os.path.join(A, base, "svg", n + ".white.svg"), encoding="utf-8").read()
    W, H = map(float, re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg).groups())
    h = int(min(130, 320 * H / W))
    im = render(svg, h)
    cx, cy = (i % COLS) * CW, (i // COLS) * CH
    # a opacidad alta + versi\u00f3n a 22 px debajo
    sheet.paste(im, (cx + (CW - im.width) // 2, cy + 24 + (130 - im.height) // 2), im)
    sm = render(svg, 22)
    sm.putalpha(sm.split()[3].point(lambda v: int(v * 0.6)))
    sheet.paste(sm, (cx + 16, cy + CH - 36), sm)
    d.text((cx + 16, cy + 8), n, fill=(120, 120, 120))
sheet.save(os.path.join(OUT := build.OUT, "hoja.png"))
print(sheet.size)
