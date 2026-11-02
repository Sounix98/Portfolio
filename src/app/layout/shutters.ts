import { Component, inject } from '@angular/core';
import { TransitionService } from '../core/transition.service';

/** 12 persianas horizontales que cubren/descubren la pantalla (loader y cambio de ruta). */
@Component({
  selector: 'app-shutters',
  template: `<div class="shutters" aria-hidden="true" [attr.data-phase]="t.phase()">
    @for (i of bands; track i) {
      <div class="shutter" [style.--i]="i" [style.top.%]="(i * 100) / 12" [style.height.%]="100 / 12 + 0.25"></div>
    }
  </div>`,
})
export class Shutters {
  protected readonly t = inject(TransitionService);
  protected readonly bands = Array.from({ length: 12 }, (_, i) => i);
}
