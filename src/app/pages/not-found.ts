import { Component, inject } from '@angular/core';
import { TLink } from '../core/tlink.directive';
import { routes } from '../content/site';
import { I18n } from '../core/i18n';

@Component({
  selector: 'app-not-found',
  imports: [TLink],
  template: `
    <main class="flex min-h-svh flex-col items-start justify-center gap-6 px-[var(--gutter)]">
      <h1 class="t-works-h1 m-0">404</h1>
      <p class="t-body text-soft">{{ ui().notFound }}</p>
      <a [tLink]="home" class="bracket t-nav">{{ ui().backHome }}</a>
    </main>
  `,
})
export class NotFound {
  protected readonly ui = inject(I18n).ui;
  protected readonly home = routes.home;
}
