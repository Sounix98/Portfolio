import { Component } from '@angular/core';
import { TLink } from '../core/tlink.directive';
import { routes } from '../content/site';

@Component({
  selector: 'app-not-found',
  imports: [TLink],
  template: `
    <main class="flex min-h-svh flex-col items-start justify-center gap-6 px-[var(--gutter)]">
      <h1 class="t-works-h1 m-0">404</h1>
      <p class="t-body text-soft">Esta página no existe.</p>
      <a [tLink]="home" class="bracket t-nav">VOLVER AL INICIO</a>
    </main>
  `,
})
export class NotFound {
  protected readonly home = routes.home;
}
