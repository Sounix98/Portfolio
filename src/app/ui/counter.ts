import { Component, computed, input, signal } from '@angular/core';
import { animate } from 'motion';
import { InViewDirective } from '../core/in-view.directive';

/** Conteo animado desde un valor cercano al final (1.2 s, ease-out). */
@Component({
  selector: 'app-counter',
  imports: [InViewDirective],
  template: `<span class="t-num" appInView margin="0px" (seen)="start()">{{ n() }}{{ suffix() }}</span>`,
})
export class Counter {
  readonly value = input.required<number>();
  readonly suffix = input('');
  private readonly current = signal<number | null>(null);
  protected readonly n = computed(() => this.current() ?? Math.round(this.value() * 0.6));

  protected start() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.current.set(this.value());
      return;
    }
    animate(Math.round(this.value() * 0.6), this.value(), {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => this.current.set(Math.round(v)),
    });
  }
}
