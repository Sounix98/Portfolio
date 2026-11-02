import { Component, ElementRef, afterNextRender, inject, viewChild, DestroyRef } from '@angular/core';

/** Aro con retardo + punto de acento. Solo con puntero fino (ver CSS); no oculta el cursor nativo. */
@Component({
  selector: 'app-cursor',
  template: `<div #ring class="cursor-ring" aria-hidden="true"></div><div #dot class="cursor-dot" aria-hidden="true"></div>`,
})
export class Cursor {
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const ring = this.ring().nativeElement;
      const dot = this.dot().nativeElement;
      let tx = -100, ty = -100, rx = -100, ry = -100, raf = 0;

      const move = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      };
      const loop = () => {
        rx += (tx - rx) * 0.16;
        ry += (ty - ry) * 0.16;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        raf = requestAnimationFrame(loop);
      };
      window.addEventListener('pointermove', move, { passive: true });
      raf = requestAnimationFrame(loop);
      destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', move);
        cancelAnimationFrame(raf);
      });
    });
  }
}
