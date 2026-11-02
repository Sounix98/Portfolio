import { Component, input } from '@angular/core';

/** Cuatro escuadras de 1 px en las esquinas del contenedor padre (que debe ser `relative`). */
@Component({
  selector: 'app-corner-brackets',
  template: `
    <span aria-hidden="true" class="pointer-events-none absolute inset-0 text-white">
      <span class="absolute border-l border-t border-current" [style]="s() + ';top:' + inset() + 'px;left:' + inset() + 'px'"></span>
      <span class="absolute border-r border-t border-current" [style]="s() + ';top:' + inset() + 'px;right:' + inset() + 'px'"></span>
      <span class="absolute border-b border-l border-current" [style]="s() + ';bottom:' + inset() + 'px;left:' + inset() + 'px'"></span>
      <span class="absolute border-b border-r border-current" [style]="s() + ';bottom:' + inset() + 'px;right:' + inset() + 'px'"></span>
    </span>
  `,
  host: { class: 'contents' },
})
export class CornerBrackets {
  readonly size = input(10);
  readonly inset = input(0);
  protected s() {
    return `width:${this.size()}px;height:${this.size()}px`;
  }
}
