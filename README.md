# Portafolio — Sounix Romero (Angular 22)

Standalone + signals, rutas con carga diferida, SSR con prerender (SSG), Tailwind v4 y `motion`. Todo en español.

```bash
npm install
npm start          # http://localhost:4200
npm run build      # build de producción (prerender de las 14 rutas)
npm run images     # optimiza ../portfolio-kit/assets → public/images (WebP) y regenera content/media.ts
```

Rutas: `/`, `/sobre-mi`, `/trabajos`, `/trabajos/:slug` (+ 404).

## Contenido

La fuente de verdad es `../portfolio-kit/GUIA_PORTAFOLIO.md`. Los datos viven en `src/app/content/` (no hay que tocar componentes):

| Archivo | Qué controla |
|---|---|
| `site.ts` | Nombre, titular, ciudad, correo, WhatsApp, textos del Home/About y etiquetas de la interfaz |
| `projects.ts` | Los 11 casos (contexto, reto, proceso, enlaces, galería). Las imágenes se citan por su ruta en el kit sin extensión |
| `experience.ts`, `expertise.ts` | Timeline, tarjetas de expertise y cifras |
| `testimonials.ts` | Testimonios (vacío: la sección no se muestra) y logos/nombres de clientes |
| `socials.ts` | Contacto (email y WhatsApp) |
| `media.ts` | Generado por `npm run images`; no editar |

## Pendientes (ver sección 11 de la guía)

- Capturas de VEXBIZ (hoy se ve un placeholder) y métricas si existen.
- Retrato de Sounix (`public/images/_portrait.svg` es un placeholder).
- LinkedIn, Behance e Instagram (@waze86, por confirmar).
- Testimonios reales y versión en inglés.
- Corregir «EST_2026» → «EST_2021» en la web de NTAC.

## Estilo

Tokens, tipografía y animaciones en `src/styles.css`. Fuente: Inter Tight (`@fontsource-variable`). Las animaciones respetan `prefers-reduced-motion`.
