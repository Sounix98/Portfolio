import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build
OUT = build.OUT
R = {json.loads(l)["name"]: json.loads(l) for l in open(os.path.join(OUT, "resultados.jsonl"), encoding="utf-8")}
av = json.loads(open(os.path.join(OUT, "resultados_avatar.json")).read().strip().splitlines()[-1])
NOTE = {
 "ledco": "Rectas H/V exactas; esquinas redondeadas de la E/L conservadas como curvas; puntas de la estrella afiladas. Simetría de la estrella: sale del contorno, no se forzó.",
 "ovejero": "Círculo y óvalos de las letras como elipses exactas; la regla es un trazo recto. Se aplicó gamma 2.2 a la fuente JPG (si no, el trazo salía ~0.3 px más fino que el PNG actual).",
 "zipo": "Lettering orgánico: se conservan todas las puntas y contraformas. Salpicaduras de menos de ~3 px² descartadas. 15.9 KB (límite 20).",
 "ntac": "Borde irregular del lettering suavizado (tolerancia 0.7 px); destellos y meridianos intactos. **10.5 KB: supera los 6 KB** (no está en la lista de excepciones); bajarlo a 6 KB exige ~170 nodos y rompe el grosor irregular.",
 "vexbiz": "Solo el wordmark (recorte y 0–440, sin leyenda). Escala nativa de la fuente (1127×439): el PNG actual (1129×439) es ~2 % más estrecho que la fuente, no se deformó. Variante `vexbiz.gold.svg`: X dorada muestreada del original = **#D39635** (no #D4A234).",
 "mercado-libre": "Fuente de 753 px. Apretón de manos reconstruido con trazos de la fuente suavizados (σ 0.6 px). El PNG actual es más tosco, por eso se midió contra la fuente. Escala ×1.7 respecto a la fuente.",
 "tucarro": "Solo la palabra, sin la flecha; mota del borde de la flecha eliminada. Escala ×2.4 respecto a la fuente (202 px de ancho). El PNG actual incluye un residuo del borde de la flecha, por eso no se usa de referencia.",
 "dviajes": "El avión queda como contraforma de la «D». Fuente de ~210 px.",
 "cafe-marketing": "**Incluye «MARKETING»** como pide el encargo; el PNG actual solo tiene la taza. Se descartaron dos marcas de otro elemento del flyer que caían dentro del recorte. Recorte ampliado a x 355–775 (el del encargo cortaba la «G»).",
 "nanologic": "Silueta monocroma de toda la ilustración (colores y negro rellenos; blancos internos como huecos), sin borde blanco ni sombra del sticker. Parte inferior «NANOLOGIC» con la «N» fundida con el trazo de la N grande (no se distingue en la fuente). El PNG actual es un recorte parcial (sin texto), se midió contra la fuente.",
 "lecheria": "Fuente ruidosa (grano de papel + JPG). Acento y signos ¡! conservados; el lema se lee a 22 px. IoU < 0.97 por la calidad de la fuente.",
 "lacosta": "El «®» queda como punto relleno: el aro y la R no se resuelven a ~12 px.",
 "conejo-mascara": "Ojos, gafas, correas y filtros conservados; detalle fino del pelaje y de las correas simplificado (fuente de ~110 px de ancho).",
 "tai-studio": "Añadido después del encargo original. Wordmark «TAI studio» del lienzo de branding; sin PNG actual, medido solo contra la fuente. Escala ×0.5.",
 "four-two": "Añadido después del encargo. **Solo el «42»**, sin «four-two» ni «streetwear» (a petición). Sin PNG actual; medido contra la fuente. Escala ×0.5.",
 "kryss-cakes": "Añadido después del encargo. Disco blanco con torta y texto recortados (el contenido rosa/dorado de la fuente pasa a hueco). «EST. 2017» no se resuelve y se pierde. Sin PNG actual; medido contra la fuente.",
 "w": "**IoU 0.92, por debajo de 0.93.** La malla del globo tiene líneas de ~1.5 px sobre una fuente ruidosa: se conserva la malla pero con celdas irregulares. **17.6 KB: supera los 6 KB.** Katakana legible.",
 "capibara": "El residuo rojo del confeti que cae en el recorte se enmascaró. El PNG actual tiene ese residuo y está desplazado: se midió contra la fuente.",
 "pesher": "Navaja entera en un solo color. «BARBER SHOP» queda como contraforma dentro de la navaja.",
}
rows = []
order = ["ledco","mercado-libre","zipo","tucarro","ntac","nanologic","dviajes","cafe-marketing","ovejero","vexbiz","tai-studio","four-two","kryss-cakes","lecheria","lacosta","conejo-mascara","w","capibara","pesher"]
LOW = {"mercado-libre","tucarro","nanologic","dviajes"}
for n in order:
    r = R[n]
    umbral = 0.93 if n in LOW or n in {"lecheria","lacosta","conejo-mascara","w","capibara","pesher"} else 0.97
    ok = "✔" if r["iou_src"] >= umbral else "✘"
    ref = f'{r["iou_hard"]:.3f}' if not build.LOGOS[n].get("native") else "—"
    folder = "clientes/svg" if build.LOGOS[n]["outdir"].startswith("clientes") else "flyers/logos/svg"
    rows.append(f'| `{n}.svg` | {build.LOGOS[n]["source_name"]} | vec.py + svgo | {r["nodes"]} | {r["bytes"]/1024:.1f} | {r["iou_src"]:.3f} {ok} (≥{umbral}) | {ref} | {r["W"]}×{r["H"]} | {NOTE[n]} |')
txt = f"""# Informe de vectorización — 19 logos (16 del encargo + 3 añadidos)

Herramienta: `herramientas/` (Python: `vec.py` propio con marching squares sobre campo ×4 suavizado, ajuste de rectas
H/V, curvas Bézier cúbicas (Schneider), esquinas vivas por intersección de rectas y elipses exactas; salida a un solo
`<path fill-rule="evenodd">`; `svgo` 3 con `viewBox` conservado). Se reproduce con `python -I build.py <nombre>`.

**Cómo se midió.** IoU binario (umbral 0.5) del SVG renderizado con `resvg` contra la silueta de la **mejor fuente**
(columna principal). Donde el PNG actual es un recorte fiel de esa fuente (ledco, ovejero, zipo, ntac, dviajes) se da
también el IoU contra él; donde el PNG actual está mal recortado o tiene residuos (tucarro, capibara, cafe-marketing,
nanologic, mercado-libre, flyers) no se usa de referencia. Comparativas (referencia = rojo, SVG = cian, coincidencia =
blanco) en `comparativas/<nombre>.png`; lado a lado en `comparativas/*_lado.png`.

Detalle que afecta a la fidelidad: las fuentes con borde suavizado hay que leerlas con **gamma 2.2** (el PNG actual
está hecho así); sin eso el vector sale ~0.3 px más fino.

| Archivo | Fuente | Herramienta | Nodos | KB | IoU vs fuente | IoU vs PNG actual | viewBox | Observaciones |
|---|---|---|---|---|---|---|---|---|
""" + "\n".join(rows) + f"""
| `avatar-ilustracion.mono.svg` | flyer, x 912–1082 de la franja | avatar.py + svgo | {av['mono_nodes']} | {av['mono_bytes']/1024:.1f} | n/a | — | {av['W']}×{av['H']} | Elipse exacta (el disco del flyer está algo achatado: {av['ellipse'][0]*2:.0f}×{av['ellipse'][1]*2:.0f} px, girado {av['ellipse'][2]:.1f}°) + aro exterior; pelo, pupilas, cejas y sombras en hueco. Texto manuscrito semitransparente «Fackingdraw» no recuperable: se pierde. 7.4 KB: supera los 6 KB. |

## Caso especial: avatar-ilustracion
Se probó la versión a color con 6 capas planas (k-means en Lab + clipPath elíptico). **IoU medio por capa = {av['iou_layers']:.2f}**
(las capas grandes llegan a 0.84–0.89, las pequeñas —luces, morado oscuro— a 0.2–0.3; exactitud por píxel {av['acc']:.2f}).
Queda por debajo del 0.90 exigido, así que **se entrega solo la versión monocroma**. La versión a color descartada se deja en
`extras/avatar-ilustracion.color-descartado.svg` por si quieres verla; no se integra.

## Resumen de incumplimientos
- Peso > 6 KB: `ntac` (10.5), `w` (17.6), `cafe-marketing` (9.0), `avatar-ilustracion.mono` (7.4), `kryss-cakes` (6.4), `four-two` ya no (1 KB), `conejo-mascara` (6.1, dentro de su límite de 20).
  `zipo` 15.9 KB está dentro de su límite de 20 KB.
- IoU: `w` 0.92 (<0.93); `lecheria` 0.937 es de baja resolución y cumple 0.93 por poco.
- `vexbiz.gold`: dorado muestreado #D39635.
- Elementos no recuperados: «®» de lacosta (punto), texto «Fackingdraw» del avatar, «N» de «NANOLOGIC» fundida con el trazo grande.
"""
open(os.path.join(OUT, "informe.md"), "w", encoding="utf-8").write(txt)
print("ok")
