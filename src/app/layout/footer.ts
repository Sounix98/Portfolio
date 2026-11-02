import { Component, input } from '@angular/core';
import { InViewDirective } from '../core/in-view.directive';
import { eventLogos } from '../content/logos';
import { footerSocials } from '../content/socials';
import { site } from '../content/site';
import { Wordmark } from '../ui/wordmark';

@Component({
  selector: 'app-footer',
  imports: [Wordmark, InViewDirective],
  template: `
    <footer class="relative flex min-h-[70svh] flex-col justify-end px-[var(--gutter)] pb-[18px] md:h-screen md:min-h-[560px]">
      <div class="flex flex-1 items-center justify-center">
        <h2 class="m-0 text-[clamp(56px,21vw,140px)] md:text-[clamp(64px,17vw,300px)]">
          <app-wordmark [text]="site.brand" />
        </h2>
      </div>

      @if (logoBand()) {
        <!-- Brazalete: cinta continua con los logos de los aliados de los eventos -->
        <div class="-mx-[var(--gutter)] mb-8 border-y border-line py-5">
          <p class="t-label-sm m-0 mb-4 px-[var(--gutter)] text-muted">EVENTOS · ALIADOS</p>
          <div class="marquee mask-fade-x overflow-hidden" appInView margin="0px" aria-label="Logos de aliados en eventos">
            <ul class="marquee-track m-0 list-none p-0" style="animation-duration: 36s">
              @for (l of band; track $index) {
                <li class="flex h-10 shrink-0 items-center px-9">
                  <img
                    [src]="l.src"
                    [alt]="$index < logos.length ? l.name : ''"
                    [attr.aria-hidden]="$index < logos.length ? null : 'true'"
                    [width]="l.w"
                    [height]="l.h"
                    loading="lazy"
                    class="h-7 w-auto opacity-60"
                    [class.grayscale]="l.mode === 'color'"
                  />
                </li>
              }
            </ul>
          </div>
        </div>
      }

      <div class="t-label flex flex-col gap-3 md:grid md:grid-cols-3 md:items-center">
        <span>© {{ site.year }} {{ site.name.toUpperCase() }}</span>
        <nav aria-label="Redes" class="flex gap-[18px] md:justify-center">
          @for (s of socials; track s.id) {
            <a class="bracket" [href]="s.href" target="_blank" rel="noopener noreferrer">{{ s.label }}</a>
          }
        </nav>
        <span class="hidden md:block"></span>
      </div>
    </footer>
  `,
})
export class Footer {
  /** Muestra el brazalete de logos sobre la barra inferior (solo en Sobre mí). */
  readonly logoBand = input(false);
  protected readonly site = site;
  protected readonly socials = footerSocials;
  protected readonly logos = eventLogos;
  // Lista duplicada para que el bucle del marquee no tenga saltos.
  protected readonly band = [...eventLogos, ...eventLogos];
}
