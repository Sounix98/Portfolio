import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild, viewChildren } from '@angular/core';
import { Project } from '../content/projects';
import { routes } from '../content/site';
import { InViewDirective } from '../core/in-view.directive';
import { TLink } from '../core/tlink.directive';

type Slot = {
  w: number; // px (base 1346)
  ratio: string;
  dx: number;
  dy: number;
  dur: number;
  depth: number;
  /** all: siempre · md: oculta en móvil · lg: oculta en móvil y tablet */
  vis: 'all' | 'md' | 'lg';
};

const SLOTS: Slot[] = [
  { w: 200, ratio: '4/3', dx: 20, dy: 14, dur: 28, depth: 1, vis: 'all' },
  { w: 245, ratio: '3/2', dx: -22, dy: 12, dur: 34, depth: 1.4, vis: 'all' },
  { w: 210, ratio: '4/3', dx: 16, dy: 18, dur: 31, depth: 0.8, vis: 'md' },
  { w: 210, ratio: '3/2', dx: -14, dy: 16, dur: 26, depth: 1.2, vis: 'all' },
  { w: 180, ratio: '3/2', dx: 18, dy: -14, dur: 37, depth: 0.9, vis: 'all' },
  { w: 190, ratio: '4/3', dx: -18, dy: 12, dur: 30, depth: 1.1, vis: 'md' },
  { w: 170, ratio: '4/3', dx: 14, dy: 10, dur: 33, depth: 0.7, vis: 'lg' },
  { w: 170, ratio: '3/2', dx: 12, dy: -12, dur: 29, depth: 1.3, vis: 'lg' },
  { w: 190, ratio: '4/3', dx: -12, dy: -10, dur: 35, depth: 0.6, vis: 'lg' },
];

/** Vueltas completas del flujo durante todo el scroll (la referencia da ~1,5 en 7 s). */
const TURNS = 1.5;

// Móvil: todas las fotos, para llenar la pantalla. Tablet: se ocultan las más pequeñas ('lg').
const shows = (vis: Slot['vis'], w: number) => w < 768 || vis !== 'lg' || w >= 1024;

/**
 * Móvil: carriles propios por foto (altura, tamaño, velocidad y giro distintos) para un caos
 * controlado que llena la pantalla; las de los extremos son las más grandes.
 */
const MOBILE = {
  y: [0.14, 0.87, 0.27, 0.77, 0.2, 0.83, 0.31, 0.71, 0.11],
  size: [1.2, 1.1, 0.9, 1.0, 0.8, 0.85, 0.95, 0.75, 1.0],
  spd: [1, 1.25, 0.8, 1.1, 0.9, 1.3, 0.85, 1.15, 1],
  rot: [-5, 4, -3, 6, -6, 3, -4, 5, -2],
};

/**
 * Flujo de fotos medido sobre la referencia (Caspia), cuadro por cuadro:
 * - Al hacer scroll todas avanzan hacia la derecha a la misma velocidad y reaparecen por la izquierda.
 * - Cada foto tiene un carril fijo (arriba o abajo, alternados). Su altura sigue un coseno:
 *   en el centro roza el borde superior/inferior; en los laterales baja hasta la altura del título.
 *   Así el flujo rodea el título sin tocarlo.
 * - El zoom sigue la misma curva: ~1,0 en el centro del carril y ~0,71 en los extremos.
 */
@Component({
  selector: 'app-floating-thumbs',
  imports: [TLink, InViewDirective],
  template: `
    <div #root appInView margin="0px" class="thumbs absolute inset-0">
      @for (item of items(); track item.project.slug; let i = $index) {
        <div
          #thumb
          class="absolute left-0 top-0 z-[42] will-change-transform hover:z-[48]"
          [style.transform]="'translate3d(-50vw, 0, 0)'"
        >
          <div [style.transform]="'translate(calc(var(--px) * ' + 12 * item.slot.depth + 'px), calc(var(--py) * ' + 12 * item.slot.depth + 'px))'">
            <div [style.animation]="'thumb-in 0.8s var(--ease) ' + (1.1 + i * 0.06) + 's backwards'">
              <a
                [tLink]="route(item.project.slug)"
                class="group relative block origin-center transition-transform duration-500 [transition-timing-function:var(--ease)] hover:scale-[1.06] focus-visible:scale-[1.06]"
              >
                <div class="relative w-full overflow-hidden rounded-card" [style.aspect-ratio]="item.slot.ratio">
                  <img
                    [src]="item.project.thumb.src"
                    [alt]="item.project.thumb.alt + ' — ' + item.project.category"
                    decoding="async"
                    class="absolute inset-0 size-full object-cover"
                  />
                </div>
                <span
                  class="t-small pointer-events-none absolute inset-x-0 top-full mt-2 flex justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span>{{ item.project.title }}</span>
                  <span>{{ item.project.year }}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FloatingThumbs {
  readonly projects = input.required<Project[]>();
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly thumbs = viewChildren<ElementRef<HTMLElement>>('thumb');
  protected route = routes.work;
  protected items() {
    return this.projects()
      .slice(0, SLOTS.length)
      .map((project, i) => ({ project, slot: SLOTS[i] }));
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.root().nativeElement;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const list = this.items();
      let W = innerWidth, H = innerHeight;
      let tx = 0, ty = 0, x = 0, y = 0; // parallax del ratón
      let target = 0, progress = 0; // scroll normalizado 0..1
      let raf = 0;
      const place = () => {
        const visible = list.map((it) => shows(it.slot.vis, W));
        const n = Math.max(1, visible.filter(Boolean).length);
        const mobile = W < 768;
        const wb = mobile
          ? Math.min(210, Math.max(130, W * 0.4)) // móvil: fotos grandes
          : Math.min(300, Math.max(96, W * 0.17)); // ancho base de una foto en el centro del carril
        const hRef = wb * 0.75;
        const cy = H * 0.48; // centro vertical del título
        const edge = H * 0.012; // la foto roza el borde superior/inferior, como en la referencia
        const Bt = cy - hRef / 2 - edge; // amplitud del carril superior
        const Bb = H - edge - hRef / 2 - cy; // amplitud del carril inferior
        const Ac = W * (mobile ? 0.46 : 0.44); // medio ancho de la curva coseno
        const Aw = W / 2 + (mobile ? wb * 1.2 : wb) / 2 + 12; // fuera de pantalla: aquí se reinicia el recorrido
        const L = 2 * Aw;
        let rank = 0;
        this.thumbs().forEach((ref, i) => {
          const node = ref.nativeElement;
          node.style.display = visible[i] ? '' : 'none';
          if (!visible[i]) return;
          const r = rank++;
          const k = r % 9;
          const [a, b] = list[i].slot.ratio.split('/').map(Number);

          if (mobile) {
            const w = wb * MOBILE.size[k];
            const h = (w * b) / a;
            const phase = (((r + 0.5) / n + progress * TURNS * MOBILE.spd[k]) % 1 + 1) % 1;
            const dx = phase * L - Aw;
            const c = Math.cos((Math.min(1, Math.abs(dx) / Ac) * Math.PI) / 2);
            let yc = H * MOBILE.y[k] + (k % 2 === 0 ? 1 : -1) * H * 0.035 * c;
            // no tapar el header ni salirse por abajo
            yc = Math.min(H - 8 - h / 2, Math.max(56 + h / 2, yc));
            const sc = 0.86 + 0.14 * c;
            node.style.width = `${w.toFixed(1)}px`;
            node.style.transform = `translate3d(${(W / 2 + dx - w / 2).toFixed(1)}px, ${(yc - h / 2).toFixed(1)}px, 0) rotate(${MOBILE.rot[k]}deg) scale(${sc.toFixed(3)})`;
            return;
          }

          const phase = (((r + 0.5) / n + progress * TURNS) % 1 + 1) % 1;
          const dx = phase * L - Aw;
          const c = Math.cos((Math.min(1, Math.abs(dx) / Ac) * Math.PI) / 2);
          const lane = r % 2 === 0 ? -1 : 1; // pares arriba, impares abajo
          const h = (wb * b) / a;
          const yc = cy + lane * (lane < 0 ? Bt : Bb) * c;
          const sc = 0.71 + 0.29 * c;
          node.style.width = `${wb.toFixed(1)}px`;
          node.style.transform = `translate3d(${(W / 2 + dx - wb / 2).toFixed(1)}px, ${(yc - h / 2).toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
        });
      };

      const readScroll = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        target = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      };
      const loop = () => {
        x += (tx - x) * 0.06;
        y += (ty - y) * 0.06;
        el.style.setProperty('--px', x.toFixed(3));
        el.style.setProperty('--py', y.toFixed(3));
        progress += (target - progress) * 0.08;
        place();
        raf = requestAnimationFrame(loop);
      };
      const onResize = () => {
        W = innerWidth;
        H = innerHeight;
        place();
      };
      const move = (e: PointerEvent) => {
        tx = (e.clientX / W) * 2 - 1;
        ty = (e.clientY / H) * 2 - 1;
      };

      place();
      addEventListener('resize', onResize);
      if (!reduced) {
        addEventListener('pointermove', move, { passive: true });
        addEventListener('scroll', readScroll, { passive: true });
        readScroll();
        progress = target;
        raf = requestAnimationFrame(loop);
      }
      destroyRef.onDestroy(() => {
        removeEventListener('resize', onResize);
        removeEventListener('pointermove', move);
        removeEventListener('scroll', readScroll);
        cancelAnimationFrame(raf);
      });
    });
  }
}
