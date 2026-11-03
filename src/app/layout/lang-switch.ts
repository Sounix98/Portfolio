import { Component, inject } from '@angular/core';
import { I18n } from '../core/i18n';

/** Selector ES / EN: guarda la preferencia y cambia todo el texto del sitio al instante. */
@Component({
  selector: 'app-lang-switch',
  template: `<div role="group" [attr.aria-label]="i18n.ui().aria.language" class="t-nav flex items-center gap-1.5">
    <button
      type="button"
      lang="es"
      aria-label="Español"
      [attr.aria-pressed]="i18n.lang() === 'es'"
      (click)="i18n.set('es')"
      class="transition-colors"
      [class]="i18n.lang() === 'es' ? 'text-ink' : 'text-muted hover:text-ink'"
    >
      ES
    </button>
    <span aria-hidden="true" class="text-dim">/</span>
    <button
      type="button"
      lang="en"
      aria-label="English"
      [attr.aria-pressed]="i18n.lang() === 'en'"
      (click)="i18n.set('en')"
      class="transition-colors"
      [class]="i18n.lang() === 'en' ? 'text-ink' : 'text-muted hover:text-ink'"
    >
      EN
    </button>
  </div>`,
})
export class LangSwitch {
  protected readonly i18n = inject(I18n);
}
