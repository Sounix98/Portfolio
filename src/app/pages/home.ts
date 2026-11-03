import { Component } from '@angular/core';
import { getProject, type Project } from '../content/projects';
import { site } from '../content/site';
import { Wordmark } from '../ui/wordmark';
import { FloatingThumbs } from './floating-thumbs';

/** La escena queda fija (sticky) mientras el scroll hace girar las fotos alrededor del wordmark. */
@Component({
  selector: 'app-home',
  imports: [FloatingThumbs, Wordmark],
  template: `
    <main class="relative h-[320svh] motion-reduce:h-svh">
      <div class="sticky top-0 h-svh min-h-[560px] overflow-hidden">
        <app-floating-thumbs [projects]="projects" />

        <section
          aria-labelledby="hero-title"
          class="pointer-events-none absolute inset-x-0 top-[55svh] z-[43] flex -translate-y-full flex-col items-center px-[var(--gutter)]"
        >
          <h1 id="hero-title" class="m-0 text-[clamp(56px,20vw,120px)] md:text-[clamp(64px,12.5vw,170px)]">
            <app-wordmark [text]="site.brand" [delay]="0.9" />
          </h1>
          <p class="pointer-events-auto absolute top-full mt-7 max-w-[380px] text-center text-[13px] font-medium leading-[1.3] md:text-[14px]">
            {{ site.heroSubtitle }}
          </p>
        </section>

        <div class="t-label pointer-events-none absolute inset-x-0 bottom-[18px] z-[43] flex flex-col gap-2 px-[var(--gutter)] text-muted md:grid md:grid-cols-3">
          <span>{{ site.role }}</span>
          <span class="md:text-center">BASADO EN {{ site.location.toUpperCase() }}</span>
          <span class="hidden md:block"></span>
        </div>
      </div>
    </main>
  `,
})
export class Home {
  // Orden pensado para alternar fotos oscuras y claras/saturadas a lo largo del flujo.
  protected readonly projects: Project[] = [
    'ntac',
    'la-festa-fest',
    'ledco',
    'branding-de-marcas',
    'cafe-marketing',
    'zipo',
    'portadas-musicales',
    'mercado-libre-tucarro',
    'flyers-de-eventos',
  ]
    .map((slug) => getProject(slug))
    .filter((p): p is Project => !!p);
  protected readonly site = site;
}
