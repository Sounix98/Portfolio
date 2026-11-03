import { Component, afterNextRender, inject, signal } from '@angular/core';
import { TransitionService } from '../core/transition.service';
import { site } from '../content/site';
import { I18n } from '../core/i18n';

const DURATION = 1400;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Loader inicial: marca, porcentaje y barra de acento sobre las persianas negras. */
@Component({
  selector: 'app-loader',
  template: `@if (visible()) {
  <div
    class="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center transition-opacity duration-300"
    [class.opacity-0]="t.released()"
    role="status"
    [attr.aria-label]="i18n.ui().aria.loading"
  >
    <div class="w-[80vw] md:w-[40vw]">
      <div class="flex items-center justify-between">
        <span class="t-nav">{{ brand }}</span>
        <span class="text-[13px] tabular-nums text-muted">{{ pct() }}%</span>
      </div>
      <div class="mt-3 h-[2px] bg-[var(--track)]">
        <div class="h-full origin-left bg-accent" [style.transform]="'scaleX(' + pct() / 100 + ')'" [style.opacity]="pct() === 100 ? 0.8 : 1"></div>
      </div>
    </div>
  </div>
  }`,
})
export class Loader {
  protected readonly t = inject(TransitionService);
  protected readonly i18n = inject(I18n);
  protected readonly brand = site.brand;
  protected readonly pct = signal(0);
  /** Solo existe en el navegador y mientras dura la carga: así su texto no queda en el footer ni en el HTML. */
  protected readonly visible = signal(false);

  constructor() {
    afterNextRender(() => {
      this.visible.set(true);
      const start = performance.now();
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        this.pct.set(100);
        setTimeout(() => this.t.release(), 260);
        setTimeout(() => this.visible.set(false), 260 + 700);
      };
      const tick = (now: number) => {
        if (done) return;
        const p = Math.min((now - start) / DURATION, 1);
        this.pct.set(Math.round(easeInOut(p) * 100));
        if (p < 1) requestAnimationFrame(tick);
        else finish();
      };
      requestAnimationFrame(tick);
      // Respaldo por si el navegador pausa rAF (pestaña oculta).
      setTimeout(finish, DURATION + 1500);
    });
  }
}
