import { Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18n } from './core/i18n';
import { TransitionService } from './core/transition.service';
import { Cursor } from './layout/cursor';
import { Header } from './layout/header';
import { Loader } from './layout/loader';
import { Shutters } from './layout/shutters';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Shutters, Loader, Cursor],
  template: `
    <app-header />
    <router-outlet />
    <app-loader />
    <app-shutters />
    <div class="grain" aria-hidden="true"></div>
    <app-cursor />
  `,
})
export class App {
  // Instanciar el servicio al arrancar para seguir la URL desde el primer NavigationEnd.
  private readonly transition = inject(TransitionService);
  private readonly i18n = inject(I18n);

  constructor() {
    // Tras la hidratación: ?lang=en o la preferencia guardada (el HTML prerenderizado es siempre en español).
    afterNextRender(() => this.i18n.init());
  }
}
