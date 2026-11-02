import { Component, computed, input } from '@angular/core';
import { InViewDirective } from '../core/in-view.directive';

/**
 * Wordmark con ciclo de color (--wm-1 → --wm-2 → --wm-3) y letras que suben desde una máscara.
 * Hereda el tamaño de fuente del padre. El ciclo se pausa fuera de viewport.
 */
@Component({
  selector: 'app-wordmark',
  imports: [InViewDirective],
  template: `<span class="wordmark" appInView margin="0px 0px -10% 0px">
    <span class="sr-only">{{ text() }}</span>
    @for (ch of letters(); track $index) {
      <span class="wm-mask" aria-hidden="true"
        ><span class="wm-letter" [style.--i]="$index" [style.--delay]="delay() + 's'">{{ ch }}</span></span
      >
    }
  </span>`,
})
export class Wordmark {
  readonly text = input.required<string>();
  readonly delay = input(0);
  protected readonly letters = computed(() => Array.from(this.text()));
}
