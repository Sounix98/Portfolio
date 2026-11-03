# Informe de vectorización — 19 logos (16 del encargo + 3 añadidos)

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
| `ledco.svg` | ledco/logos/ledco-logo-blanco.png | vec.py + svgo | 150 | 2.7 | 0.997 ✔ (≥0.97) | 0.999 | 703×304 | Rectas H/V exactas; esquinas redondeadas de la E/L conservadas como curvas; puntas de la estrella afiladas. Simetría de la estrella: sale del contorno, no se forzó. |
| `mercado-libre.svg` | mercadolibre-tucarro/tucarro-promo.jpg (recorte 66,588-312,668) | vec.py + svgo | 264 | 6.0 | 0.943 ✔ (≥0.93) | — | 397×102 | Fuente de 753 px. Apretón de manos reconstruido con trazos de la fuente suavizados (σ 0.6 px). El PNG actual es más tosco, por eso se midió contra la fuente. Escala ×1.7 respecto a la fuente. |
| `zipo.svg` | zipo/zipo-logo-blanco.png | vec.py + svgo | 614 | 15.9 | 0.993 ✔ (≥0.97) | 0.993 | 881×700 | Lettering orgánico: se conservan todas las puntas y contraformas. Salpicaduras de menos de ~3 px² descartadas. 15.9 KB (límite 20). |
| `tucarro.svg` | mercadolibre-tucarro/tucarro-promo.jpg (recorte 350,602-552,654) | vec.py + svgo | 111 | 2.5 | 0.954 ✔ (≥0.93) | — | 409×87 | Solo la palabra, sin la flecha; mota del borde de la flecha eliminada. Escala ×2.4 respecto a la fuente (202 px de ancho). El PNG actual incluye un residuo del borde de la flecha, por eso no se usa de referencia. |
| `ntac.svg` | ntac/ntac-logo-blanco.png | vec.py + svgo | 351 | 10.5 | 0.972 ✔ (≥0.97) | 0.974 | 955×506 | Borde irregular del lettering suavizado (tolerancia 0.7 px); destellos y meridianos intactos. **10.5 KB: supera los 6 KB** (no está en la lista de excepciones); bajarlo a 6 KB exige ~170 nodos y rompe el grosor irregular. |
| `nanologic.svg` | cafe-marketing/nanologic-delivery-gratis.png (recorte 200,1000-480,1280) | vec.py + svgo | 255 | 5.1 | 0.948 ✔ (≥0.93) | — | 161×180 | Silueta monocroma de toda la ilustración (colores y negro rellenos; blancos internos como huecos), sin borde blanco ni sombra del sticker. Parte inferior «NANOLOGIC» con la «N» fundida con el trazo de la N grande (no se distingue en la fuente). El PNG actual es un recorte parcial (sin texto), se midió contra la fuente. |
| `dviajes.svg` | cafe-marketing/dviajes-plan-bad-bunny-02-paquete.png (recorte 325,214-535,268) | vec.py + svgo | 137 | 2.6 | 0.976 ✔ (≥0.93) | 0.952 | 546×99 | El avión queda como contraforma de la «D». Fuente de ~210 px. |
| `cafe-marketing.svg` | cafe-marketing/cafemkt-promo-04-agenda-tu-cita.png (recorte 355,650-775,1160) | vec.py + svgo | 447 | 9.0 | 0.979 ✔ (≥0.97) | — | 360×459 | **Incluye «MARKETING»** como pide el encargo; el PNG actual solo tiene la taza. Se descartaron dos marcas de otro elemento del flyer que caían dentro del recorte. Recorte ampliado a x 355–775 (el del encargo cortaba la «G»). |
| `ovejero.svg` | branding/ovejero-uniformes.jpg (recorte 1250,600-1750,1110) | vec.py + svgo | 281 | 5.3 | 0.991 ✔ (≥0.97) | 0.983 | 455×363 | Círculo y óvalos de las letras como elipses exactas; la regla es un trazo recto. Se aplicó gamma 2.2 a la fuente JPG (si no, el trazo salía ~0.3 px más fino que el PNG actual). |
| `vexbiz.svg` | VEXBIZ FONDO OSCUROEX.png (recorte y 0-440) | vec.py + svgo | 182 | 2.2 | 0.997 ✔ (≥0.97) | — | 1127×439 | Solo el wordmark (recorte y 0–440, sin leyenda). Escala nativa de la fuente (1127×439): el PNG actual (1129×439) es ~2 % más estrecho que la fuente, no se deformó. Variante `vexbiz.gold.svg`: X dorada muestreada del original = **#D39635** (no #D4A234). |
| `tai-studio.svg` | branding/tai-studio.jpg (recorte 760,70-1230,390) | vec.py + svgo | 121 | 2.2 | 0.991 ✔ (≥0.97) | — | 189×126 | Añadido después del encargo original. Wordmark «TAI studio» del lienzo de branding; sin PNG actual, medido solo contra la fuente. Escala ×0.5. |
| `four-two.svg` | branding/four-two-streetwear.jpg (recorte 740,95-1260,322, solo el 42) | vec.py + svgo | 57 | 1.0 | 0.993 ✔ (≥0.97) | — | 213×95 | Añadido después del encargo. **Solo el «42»**, sin «four-two» ni «streetwear» (a petición). Sin PNG actual; medido contra la fuente. Escala ×0.5. |
| `kryss-cakes.svg` | branding/kryss-cakes.jpg (recorte 735,0-1245,510) | vec.py + svgo | 293 | 6.4 | 0.976 ✔ (≥0.97) | — | 195×195 | Añadido después del encargo. Disco blanco con torta y texto recortados (el contenido rosa/dorado de la fuente pasa a hueco). «EST. 2017» no se resuelve y se pierde. Sin PNG actual; medido contra la fuente. |
| `lecheria.svg` | flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg franja x45-353 | vec.py + svgo | 220 | 5.8 | 0.937 ✔ (≥0.93) | — | 309×108 | Fuente ruidosa (grano de papel + JPG). Acento y signos ¡! conservados; el lema se lee a 22 px. IoU < 0.97 por la calidad de la fuente. |
| `lacosta.svg` | flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg franja x427-810 | vec.py + svgo | 165 | 3.8 | 0.974 ✔ (≥0.93) | — | 383×69 | El «®» queda como punto relleno: el aro y la R no se resuelven a ~12 px. |
| `conejo-mascara.svg` | flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg franja x1188-1300 | vec.py + svgo | 269 | 6.1 | 0.953 ✔ (≥0.93) | — | 114×201 | Ojos, gafas, correas y filtros conservados; detalle fino del pelaje y de las correas simplificado (fuente de ~110 px de ancho). |
| `w.svg` | flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg franja x1404-1589 | vec.py + svgo | 661 | 17.6 | 0.920 ✘ (≥0.93) | — | 185×147 | **IoU 0.92, por debajo de 0.93.** La malla del globo tiene líneas de ~1.5 px sobre una fuente ruidosa: se conserva la malla pero con celdas irregulares. **17.6 KB: supera los 6 KB.** Katakana legible. |
| `capibara.svg` | flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg franja x1660-2022 | vec.py + svgo | 312 | 5.9 | 0.963 ✔ (≥0.93) | — | 338×97 | El residuo rojo del confeti que cae en el recorte se enmascaró. El PNG actual tiene ese residuo y está desplazado: se midió contra la fuente. |
| `pesher.svg` | flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg franja x2060-2356 | vec.py + svgo | 309 | 5.0 | 0.983 ✔ (≥0.93) | — | 296×144 | Navaja entera en un solo color. «BARBER SHOP» queda como contraforma dentro de la navaja. |
| `avatar-ilustracion.mono.svg` | flyer, x 912–1082 de la franja | avatar.py + svgo | 332 | 7.4 | n/a | — | 168×150 | Elipse exacta (el disco del flyer está algo achatado: 168×150 px, girado 8.2°) + aro exterior; pelo, pupilas, cejas y sombras en hueco. Texto manuscrito semitransparente «Fackingdraw» no recuperable: se pierde. 7.4 KB: supera los 6 KB. |

## Caso especial: avatar-ilustracion
Se probó la versión a color con 6 capas planas (k-means en Lab + clipPath elíptico). **IoU medio por capa = 0.56**
(las capas grandes llegan a 0.84–0.89, las pequeñas —luces, morado oscuro— a 0.2–0.3; exactitud por píxel 0.89).
Queda por debajo del 0.90 exigido, así que **se entrega solo la versión monocroma**. La versión a color descartada se deja en
`extras/avatar-ilustracion.color-descartado.svg` por si quieres verla; no se integra.

## Resumen de incumplimientos
- Peso > 6 KB: `ntac` (10.5), `w` (17.6), `cafe-marketing` (9.0), `avatar-ilustracion.mono` (7.4), `kryss-cakes` (6.4), `four-two` ya no (1 KB), `conejo-mascara` (6.1, dentro de su límite de 20).
  `zipo` 15.9 KB está dentro de su límite de 20 KB.
- IoU: `w` 0.92 (<0.93); `lecheria` 0.937 es de baja resolución y cumple 0.93 por poco.
- `vexbiz.gold`: dorado muestreado #D39635.
- Elementos no recuperados: «®» de lacosta (punto), texto «Fackingdraw» del avatar, «N» de «NANOLOGIC» fundida con el trazo grande.
