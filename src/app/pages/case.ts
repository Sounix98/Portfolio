import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal, viewChild } from '@angular/core';
import { scroll } from 'motion';
import { routes } from '../content/site';
import { I18n } from '../core/i18n';
import { InViewDirective } from '../core/in-view.directive';
import { TLink } from '../core/tlink.directive';
import { Footer } from '../layout/footer';
import { CornerBrackets } from '../ui/corner-brackets';
import { Icon } from '../ui/icon';
import { NotFound } from './not-found';

@Component({
  selector: 'app-case',
  imports: [NgOptimizedImage, TLink, InViewDirective, Footer, Icon, CornerBrackets, NotFound],
  template: `
    @if (project(); as p) {
      <main>
        <section #hero aria-labelledby="case-title" class="relative h-svh min-h-[560px] overflow-hidden">
          <div #parallax class="absolute -inset-y-[10%] inset-x-0">
            @if (p.heroLogos) {
              <!-- introducción con logo: sin fotografía -->
            } @else if (p.heroSlides; as slides) {
              @for (s of slides; track s.src; let i = $index) {
                <img
                  [ngSrc]="s.src"
                  fill
                  [priority]="i === 0"
                  [loading]="i === 0 ? undefined : 'eager'"
                  sizes="100vw"
                  class="hero-slide object-cover"
                  [class.is-active]="i === slide()"
                  [alt]="i === 0 ? s.alt : ''"
                  [attr.aria-hidden]="i === slide() ? null : 'true'"
                />
              }
            } @else {
              <img [ngSrc]="p.cover.src" fill priority sizes="100vw" class="object-cover" [alt]="p.cover.alt" />
            }
          </div>
          <div aria-hidden="true" class="absolute inset-0 bg-[var(--overlay-hero)]"></div>
          @if (p.heroLogos; as logos) {
            <div class="pointer-events-none absolute inset-x-0 top-[calc(5%+68px)] bottom-[61%] px-[var(--gutter)]">
              <div class="relative mx-auto h-full w-[min(560px,78vw)]">
                @for (l of logos; track l.src; let i = $index) {
                  <img
                    [ngSrc]="l.src"
                    fill
                    [priority]="i === 0"
                    [loading]="i === 0 ? undefined : 'eager'"
                    sizes="(max-width: 700px) 78vw, 560px"
                    class="hero-slide object-contain"
                    [class.is-active]="i === slide()"
                    [alt]="i === 0 ? l.alt : ''"
                    [attr.aria-hidden]="i === slide() ? null : 'true'"
                  />
                }
              </div>
            </div>
          }

          <div class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <span class="t-label rounded-full bg-[rgba(40,40,40,0.7)] px-2.5 py-1.5">{{ p.year }} · {{ p.category }}</span>
            @if (p.label) {
              <span class="t-label mt-2 text-accent">{{ p.label }}</span>
            }
            <div class="t-label relative mt-[34px] flex min-h-9 w-[min(480px,90vw)] items-center justify-center px-5 py-2 text-center">
              <app-corner-brackets [size]="8" />
              {{ p.tagline }}
            </div>
          </div>

          <div class="absolute inset-x-0 bottom-[18px] px-[var(--gutter)]">
            <a [tLink]="worksRoute" class="group t-label inline-flex items-center gap-1.5">
              <app-icon name="arrow-left" class="transition-transform duration-200 group-hover:-translate-x-[3px]" />
              {{ ui().allWorks }}
            </a>
            <h1 id="case-title" class="t-case-h1 m-0 mt-[30px]">{{ p.title }}</h1>
          </div>
        </section>

        <div class="relative bg-bg">
          <div class="mx-auto w-full max-w-[var(--container-case)] px-[var(--gutter)] pb-[clamp(100px,12vw,160px)] pt-[clamp(80px,9vw,120px)] lg:px-0">
            <!-- Detalles -->
            <section aria-labelledby="details-title" class="grid gap-4 md:grid-cols-[160px_1fr] lg:grid-cols-[42%_1fr]">
              <h2 id="details-title" class="t-label m-0 text-muted">{{ ui().details }}</h2>
              <div class="max-w-[596px]">
                <p class="t-quote m-0 max-w-[560px]">{{ p.intro }}</p>
                <dl class="m-0 mt-10">
                  <div class="divider" appInView></div>
                  @for (m of meta(); track m[0]) {
                    <div>
                      <div class="flex min-h-[37px] items-center justify-between gap-6 py-2">
                        <dt class="t-label text-muted">{{ m[0] }}</dt>
                        <dd class="t-label m-0 text-right">{{ m[1] }}</dd>
                      </div>
                      <div class="divider" appInView></div>
                    </div>
                  }
                  @if (p.links?.length) {
                    <div>
                      <div class="flex min-h-[37px] items-center justify-between gap-6 py-2">
                        <dt class="t-label text-muted">{{ ui().links }}</dt>
                        <dd class="t-label m-0 flex gap-4">
                          @for (l of p.links; track l.url) {
                            <a [href]="l.url" target="_blank" rel="noopener noreferrer" class="bracket">{{ l.label }} ↗</a>
                          }
                        </dd>
                      </div>
                      <div class="divider" appInView></div>
                    </div>
                  }
                </dl>
              </div>
            </section>

            <!-- El reto -->
            <section aria-labelledby="premise-title" class="mt-[clamp(60px,8vw,110px)] grid gap-4 md:grid-cols-[160px_1fr] lg:grid-cols-[42%_1fr]">
              <h2 id="premise-title" class="t-label m-0 text-muted">{{ ui().premise }}</h2>
              <div class="max-w-[596px]">
                <h3 class="t-h3 m-0 text-[clamp(22px,2.1vw,26px)]">{{ p.premise.title }}</h3>
                <div class="mt-5 flex flex-col gap-5 text-[16px] leading-[1.55]">
                  @for (par of p.premise.paragraphs; track $index) {
                    <p class="m-0">{{ par }}</p>
                  }
                </div>
              </div>
            </section>

            <!-- Proceso -->
            @if (p.process.length) {
              <section aria-labelledby="process-title" class="mt-[clamp(48px,6vw,60px)] grid gap-4 md:grid-cols-[160px_1fr] lg:grid-cols-[42%_1fr]">
                <h2 id="process-title" class="t-label m-0 text-muted">{{ ui().process }}</h2>
                <ol class="m-0 flex max-w-[596px] list-none flex-col gap-8 p-0 md:gap-10">
                  @for (step of p.process; track step.title; let i = $index) {
                    <li>
                      <p class="t-label-sm m-0 text-muted">0{{ i + 1 }}</p>
                      <h3 class="t-quote m-0 mt-2">{{ step.title }}</h3>
                      <p class="t-small mt-2 max-w-[500px]">{{ step.text }}</p>
                    </li>
                  }
                </ol>
              </section>
            }

            <!-- Galería: proporciones reales; las apaisadas ocupan las dos columnas -->
            @if (p.galleryGroups; as groups) {
              @for (grp of groups; track grp.title) {
                <section [attr.aria-label]="grp.title" class="mt-[clamp(70px,9vw,120px)]">
                  <h2 class="t-label m-0 mb-5 text-muted">{{ grp.title }}</h2>
                  <div class="grid grid-cols-1 gap-[7px] md:grid-cols-2">
                    @for (g of grp.images; track g.src) {
                      <div class="reveal overflow-hidden rounded-card" appInView [style.--y]="'0px'" [class.md:col-span-2]="g.w / g.h > 1.3">
                        <img [ngSrc]="g.src" [width]="g.w" [height]="g.h" sizes="(max-width: 1100px) 100vw, 71vw" class="h-auto w-full" [alt]="g.alt" />
                      </div>
                    }
                  </div>
                </section>
              }
            } @else {
              <section [attr.aria-label]="ui().aria.gallery" class="mt-[clamp(80px,10vw,130px)] grid grid-cols-1 gap-[7px] md:grid-cols-2">
                @for (g of p.gallery; track g.src) {
                  <div class="reveal overflow-hidden rounded-card" appInView [style.--y]="'0px'" [class.md:col-span-2]="g.w / g.h > 1.3">
                    <img [ngSrc]="g.src" [width]="g.w" [height]="g.h" sizes="(max-width: 1100px) 100vw, 71vw" class="h-auto w-full" [alt]="g.alt" />
                  </div>
                }
              </section>
            }
          </div>

          <a
            [tLink]="route(next().slug)"
            class="group mx-auto mb-[clamp(80px,10vw,140px)] flex w-full max-w-[var(--container-case)] items-center justify-between gap-6 border-y border-line px-[var(--gutter)] py-6 lg:px-0"
          >
            <span class="t-toggle flex items-center gap-3">
              {{ ui().nextProject }}
              <app-icon name="arrow-right" [size]="18" class="transition-transform duration-200 group-hover:translate-x-[3px]" />
            </span>
            <span class="flex items-center gap-4">
              <span class="t-label hidden sm:block">{{ next().title }}</span>
              <span class="relative block h-[60px] w-[80px] overflow-hidden rounded-card">
                <img [ngSrc]="next().thumb.src" fill sizes="6vw" alt="" class="object-cover" />
              </span>
            </span>
          </a>
        </div>
      </main>
      <app-footer />
    } @else {
      <app-not-found />
    }
  `,
})
export class Case {
  readonly slug = input.required<string>();
  private readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly worksRoute = routes.works;
  protected route = routes.work;
  protected readonly project = computed(() => this.i18n.project(this.slug()));
  protected readonly next = computed(() => this.i18n.nextProject(this.slug()));
  protected readonly meta = computed<string[][]>(() => {
    const p = this.project();
    if (!p) return [];
    const rows = p.facts
      ? p.facts.map((f) => [f.label, f.value])
      : [
          [this.ui().client, p.client],
          [this.ui().year, p.year],
          [this.ui().role, p.role],
        ];
    if (!p.facts && p.label) rows.push([this.ui().type, p.label]);
    if (p.tools) rows.push([this.ui().tools, p.tools]);
    return rows;
  });

  private readonly hero = viewChild<ElementRef<HTMLElement>>('hero');
  private readonly parallax = viewChild<ElementRef<HTMLElement>>('parallax');
  /** Índice de la imagen visible en el carrusel del hero. */
  protected readonly slide = signal(0);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // Carrusel del fondo: una imagen nueva cada 3 s (quieto si se prefiere menos movimiento).
      const count = this.project()?.heroLogos?.length ?? this.project()?.heroSlides?.length ?? 0;
      if (count > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const timer = setInterval(() => this.slide.update((i) => (i + 1) % count), 3000);
        destroyRef.onDestroy(() => clearInterval(timer));
      }

      const hero = this.hero()?.nativeElement;
      const layer = this.parallax()?.nativeElement;
      if (!hero || !layer || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const stop = scroll((p: number) => (layer.style.transform = `translateY(${p * 20}%)`), {
        target: hero,
        offset: ['start start', 'end start'],
      });
      destroyRef.onDestroy(stop);
    });
  }
}
