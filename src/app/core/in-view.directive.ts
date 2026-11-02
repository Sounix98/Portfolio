import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, output } from '@angular/core';

/**
 * Observa el elemento con IntersectionObserver:
 * - `in-view`: se añade la primera vez que entra (queda puesta).
 * - `is-visible`: refleja si está en viewport ahora (sirve para pausar animaciones).
 */
@Directive({ selector: '[appInView]' })
export class InViewDirective {
  /** rootMargin, p. ej. "0px 0px -10% 0px". */
  readonly margin = input('0px 0px -8% 0px');
  readonly seen = output<void>();

  constructor() {
    const el: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let first = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          el.classList.toggle('is-visible', entry.isIntersecting);
          if (entry.isIntersecting && first) {
            first = false;
            el.classList.add('in-view');
            this.seen.emit();
          }
        },
        { rootMargin: this.margin() },
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
