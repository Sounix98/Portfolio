import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { projects } from '../content/projects';
import { routes, site, ui } from '../content/site';
import { InViewDirective } from '../core/in-view.directive';
import { TLink } from '../core/tlink.directive';
import { Footer } from '../layout/footer';
import { CornerBrackets } from '../ui/corner-brackets';
import { Icon } from '../ui/icon';

type View = 'grid' | 'full';

@Component({
  selector: 'app-works',
  imports: [NgOptimizedImage, TLink, InViewDirective, Footer, Icon, CornerBrackets],
  template: `
    <main>
      <div class="px-[var(--gutter)] pt-[clamp(110px,15vw,200px)]">
        <h1 class="t-works-h1 m-0 flex items-start gap-1">
          {{ ui.nav.works }}
          <sup class="mt-1 text-[22px] font-medium tracking-normal" [attr.aria-label]="projects.length + ' proyectos'">({{ projects.length }})</sup>
        </h1>

        <div class="mt-10 grid items-end gap-6 md:grid-cols-3 md:gap-2">
          <p class="max-w-[720px] text-[16px] leading-[1.55] text-soft md:col-span-2">{{ site.worksDescription }}</p>
          <div role="group" [attr.aria-label]="ui.view" class="flex items-center gap-16 lg:gap-[220px]">
            <button type="button" [attr.aria-pressed]="view() === 'grid'" (click)="view.set('grid')" class="t-toggle flex items-center gap-2 transition-colors" [class]="view() === 'grid' ? 'text-ink' : 'text-dim hover:text-soft'">
              {{ ui.grid }} <app-icon name="grid" [size]="14" />
            </button>
            <button type="button" [attr.aria-pressed]="view() === 'full'" (click)="view.set('full')" class="t-toggle flex items-center gap-2 transition-colors" [class]="view() === 'full' ? 'text-ink' : 'text-dim hover:text-soft'">
              {{ ui.full }} <app-icon name="full" [size]="14" />
            </button>
          </div>
        </div>
      </div>

      @if (view() === 'grid') {
        <ul
          class="fade-in m-0 mt-[clamp(64px,9vw,125px)] grid list-none grid-cols-1 gap-x-2 gap-y-12 p-0 px-[var(--gutter)] pb-24 [--col:calc((100vw-2*var(--gutter)-8px)/2)] md:grid-cols-2 md:gap-y-0 lg:grid-cols-3 lg:[--col:calc((100vw-2*var(--gutter)-16px)/3)]"
        >
          @for (p of projects; track p.slug; let i = $index) {
            <li class="reveal md:h-[calc(var(--col)*0.995+3.5rem)]" appInView [style.--d]="(i % 3) * 0.08 + 's'" [style.--y]="'30px'">
              <a [tLink]="route(p.slug)" class="group block">
                <p class="t-label mb-2">{{ p.year }} · {{ p.category }}</p>
                <!-- La imagen crece de 4:3 a ~1:1 en hover y empuja su título; el slot reserva la altura máxima. -->
                <div class="relative aspect-[4/3] overflow-hidden rounded-card transition-[aspect-ratio] duration-500 [transition-timing-function:var(--ease)] md:group-hover:aspect-[432/430] md:group-focus-visible:aspect-[432/430]">
                  <img [ngSrc]="p.thumb.src" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" class="object-cover" [alt]="p.title + ' — ' + p.category" />
                  <span class="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15"></span>
                </div>
                <h2 class="mt-2.5 text-[15px] font-semibold leading-none">{{ p.title }}</h2>
              </a>
            </li>
          }
        </ul>
      } @else {
        <ul class="fade-in m-0 mx-[var(--gutter)] mt-[clamp(64px,9vw,125px)] list-none p-0">
          @for (p of projects; track p.slug) {
            <li>
              <a
                [tLink]="route(p.slug)"
                class="relative block h-[80svh] overflow-hidden rounded-panel md:h-screen"
                [attr.aria-label]="p.title + ' — ' + p.year + ', ' + p.category"
              >
                <img [ngSrc]="p.cover.src" fill sizes="100vw" alt="" class="scale-110 object-cover blur-[24px] brightness-[0.55]" />
                <span aria-hidden="true" class="absolute inset-0 bg-[var(--overlay-full)]"></span>

                <div class="absolute inset-0 flex flex-col items-center justify-center max-md:gap-4">
                  <span class="t-toggle hidden text-ink md:absolute md:left-[18px] md:top-1/2 md:block md:-translate-y-1/2">{{ p.year }}</span>
                  <span class="t-toggle hidden text-ink md:absolute md:right-[18px] md:top-1/2 md:block md:-translate-y-1/2">{{ p.category }}</span>

                  <span class="text-[20px] font-medium md:hidden">{{ p.year }}</span>
                  <div class="relative aspect-video w-[90%] md:w-[min(590px,70%)]">
                    <img [ngSrc]="p.cover.src" fill sizes="(max-width: 768px) 90vw, 41vw" class="rounded-card object-cover" [alt]="p.title + ' — ' + p.category" />
                    <app-corner-brackets [size]="10" [inset]="14" />
                    <span class="t-label absolute left-0 top-full mt-5">{{ p.title }}</span>
                  </div>
                  <span class="text-[20px] font-medium md:hidden">{{ p.category }}</span>
                </div>
              </a>
            </li>
          }
        </ul>
      }
    </main>
    <app-footer />
  `,
})
export class Works {
  protected readonly projects = projects;
  protected readonly site = site;
  protected readonly ui = ui;
  protected readonly view = signal<View>('grid');
  protected route = routes.work;
}
