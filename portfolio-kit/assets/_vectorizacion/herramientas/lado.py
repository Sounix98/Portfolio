"""Comparativa lado a lado PNG actual vs SVG nuevo (300 px y 22 px de alto) sobre #0a0a0a."""
import sys, os, io; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np, resvg_py
from PIL import Image, ImageDraw
import build
A = build.A
for n in sys.argv[1:]:
    svg = open(os.path.join(A, build.LOGOS[n]['outdir'], n + '.white.svg'), encoding='utf-8').read()
    ref = Image.open(os.path.join(A, build.LOGOS[n]['ref'])).convert('RGBA')
    ys, xs = np.where(np.asarray(ref.split()[3]) > 10)
    ref = ref.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    W, H = ref.size
    tiles = []
    for h in (300, 22):
        w = round(W * h / H)
        im = Image.open(io.BytesIO(bytes(resvg_py.svg_to_bytes(svg_string=svg, width=w, height=h)))).convert('RGBA')
        tiles.append((ref.resize((w, h), Image.LANCZOS), im))
    cw = tiles[0][0].width
    canvas = Image.new('RGB', (cw * 2 + 60, 300 + 22 + 80), (10, 10, 10))
    for col in (0, 1):
        x = 20 + col * (cw + 20)
        canvas.paste(tiles[0][col], (x, 24), tiles[0][col])
        canvas.paste(tiles[1][col], (x, 352), tiles[1][col])
    d = ImageDraw.Draw(canvas)
    d.text((20, 6), 'PNG actual', fill=(150, 150, 150)); d.text((cw + 40, 6), 'SVG nuevo', fill=(150, 150, 150))
    canvas.save(os.path.join(A, '_vectorizacion', 'comparativas', n + '_lado.png'))
