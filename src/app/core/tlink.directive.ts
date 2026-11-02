import { Directive, inject, input } from '@angular/core';
import { TransitionService } from './transition.service';

/** `<a tLink="/ruta">`: enlace interno que navega con la transición de persianas. */
@Directive({
  selector: 'a[tLink]',
  host: { '[attr.href]': 'tLink()', '(click)': 'onClick($event)' },
})
export class TLink {
  readonly tLink = input.required<string>();
  private readonly transition = inject(TransitionService);

  onClick(e: MouseEvent) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    this.transition.navigate(this.tLink());
  }
}
