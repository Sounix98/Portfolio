import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { TLink } from '../core/tlink.directive';
import { TransitionService } from '../core/transition.service';
import { routes } from '../content/site';
import { I18n } from '../core/i18n';
import { LangSwitch } from './lang-switch';
import { Icon } from '../ui/icon';

@Component({
  selector: 'app-header',
  imports: [TLink, Icon, LangSwitch],
  template: `
    <header class="fixed inset-x-0 top-0 h-[46px]" [class]="open() ? 'z-[49]' : 'z-40'">
      <div class="relative z-[52] flex h-full items-center justify-between px-[var(--gutter)]">
        <a [tLink]="home" class="t-nav" [attr.aria-label]="site().name + ui().aria.homeSuffix">{{ site().brand }}</a>

        <nav [attr.aria-label]="ui().aria.main" class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          @for (l of links(); track l.href) {
            <a [tLink]="l.href" class="bracket t-nav" [attr.aria-current]="isActive(l.href) ? 'page' : null">{{ l.label }}</a>
          }
        </nav>

        <div class="hidden items-center gap-8 md:flex">
          <app-lang-switch />
          <a [href]="'mailto:' + site().email" class="group t-nav flex items-center gap-1.5">
            {{ ui().nav.contact }}
            <app-icon name="arrow-right" class="transition-transform duration-200 group-hover:translate-x-[3px]" />
          </a>
        </div>

        <div class="flex items-center gap-5 md:hidden">
        <app-lang-switch />
        <button
          #menuButton
          type="button"
          class="bracket t-nav"
          [attr.aria-expanded]="open()"
          aria-controls="menu-overlay"
          [attr.aria-current]="open() ? 'page' : null"
          (click)="toggle()"
        >
          {{ open() ? ui().nav.close : ui().nav.menu }}
        </button>
        </div>
      </div>

      <div
        #menu
        id="menu-overlay"
        class="fixed inset-0 z-[51] bg-black px-[var(--gutter)] pt-24 transition-[clip-path,visibility] duration-500 [transition-timing-function:var(--ease)] md:hidden"
        [style.clip-path]="open() ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)'"
        [style.visibility]="open() ? 'visible' : 'hidden'"
        [attr.inert]="open() ? null : ''"
      >
        <nav [attr.aria-label]="ui().aria.mobileMenu" class="flex flex-col items-start gap-3">
          @for (l of mobileLinks(); track l.href; let i = $index) {
            <a
              [tLink]="l.href"
              class="bracket text-[40px] font-semibold uppercase leading-none tracking-[-0.03em] transition-all duration-500"
              [class.opacity-0]="!open()"
              [class.translate-y-6]="!open()"
              [style.transition-delay]="open() ? 0.15 + i * 0.06 + 's' : '0s'"
              [attr.aria-current]="isActive(l.href) ? 'page' : null"
              >{{ l.label }}</a
            >
          }
          <a
            [href]="'mailto:' + site().email"
            class="bracket text-[40px] font-semibold uppercase leading-none tracking-[-0.03em] transition-all duration-500"
            [class.opacity-0]="!open()"
            [class.translate-y-6]="!open()"
            [style.transition-delay]="open() ? 0.15 + mobileLinks().length * 0.06 + 's' : '0s'"
            >{{ ui().nav.contact }}</a
          >
        </nav>
      </div>
    </header>
  `,
})
export class Header {
  private readonly t = inject(TransitionService);
  private readonly menu = viewChild.required<ElementRef<HTMLElement>>('menu');
  private readonly button = viewChild.required<ElementRef<HTMLElement>>('menuButton');

  private readonly i18n = inject(I18n);
  protected readonly site = this.i18n.site;
  protected readonly ui = this.i18n.ui;
  protected readonly home = routes.home;
  protected readonly links = computed(() => [
    { href: routes.works, label: this.ui().nav.works },
    { href: routes.about, label: this.ui().nav.about },
  ]);
  // Los enlaces internos pasan por tLink; el correo de contacto se añade solo en el menú móvil.
  protected readonly mobileLinks = this.links;

  /** El menú está abierto únicamente en la ruta donde se abrió: se cierra solo al navegar. */
  private readonly openAt = signal<string | null>(null);
  protected readonly open = computed(() => this.openAt() === this.t.url());

  constructor() {
    effect((onCleanup) => {
      if (!this.open()) return;
      document.body.style.overflow = 'hidden';
      const items = () => [
        ...Array.from(this.menu().nativeElement.querySelectorAll<HTMLElement>('a')),
        this.button().nativeElement,
      ];
      items()[0]?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.openAt.set(null);
        if (e.key !== 'Tab') return;
        const all = items();
        const first = all[0];
        const last = all[all.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', onKey);
      onCleanup(() => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
      });
    });
  }

  protected isActive(href: string) {
    return this.t.url().startsWith(href);
  }

  protected toggle() {
    this.openAt.set(this.open() ? null : this.t.url());
  }
}
