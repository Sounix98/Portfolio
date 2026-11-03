import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal, viewChild } from '@angular/core';
import { scroll } from 'motion';
import { experience } from '../../content/experience';
import { expertise, stats } from '../../content/expertise';
import { socials } from '../../content/socials';
import { ui } from '../../content/site';
import { clientLogos } from '../../content/logos';
import { testimonials } from '../../content/testimonials';
import { InViewDirective } from '../../core/in-view.directive';
import { Counter } from '../../ui/counter';
import { Icon } from '../../ui/icon';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Texto que pasa de gris a blanco palabra a palabra según el scroll. */
@Component({
  selector: 'app-statement-reveal',
  template: `<h1 #h1 [id]="headingId()" class="t-statement max-w-[620px]" [attr.aria-label]="text()">
    @for (w of words(); track $index) {
      <span aria-hidden="true" class="word text-dim">{{ w }}</span>{{ ' ' }}
    }
  </h1>`,
})
export class StatementReveal {
  readonly text = input.required<string>();
  readonly headingId = input("");;
  private readonly h1 = viewChild.required<ElementRef<HTMLElement>>('h1');
  protected words() {
    return this.text().split(' ');
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.h1().nativeElement;
      const spans = Array.from(el.querySelectorAll<HTMLElement>('.word'));
      if (reduced()) {
        spans.forEach((s) => (s.style.color = '#fff'));
        return;
      }
      const n = spans.length;
      const stop = scroll(
        (progress: number) => {
          spans.forEach((s, i) => {
            const t = Math.min(1, Math.max(0, (progress - i / n) / (1 / n)));
            const v = Math.round(94 + (255 - 94) * t);
            s.style.color = `rgb(${v},${v},${v})`;
          });
        },
        { target: el, offset: ['start 0.8', 'end 0.3'] },
      );
      destroyRef.onDestroy(stop);
    });
  }
}

@Component({
  selector: 'app-stats',
  imports: [Counter, InViewDirective],
  template: `<dl class="m-0">
    @for (s of stats; track s.label; let i = $index) {
      <div>
        <div class="flex h-[47px] items-center justify-between">
          <dd class="m-0 order-1"><app-counter [value]="s.value" [suffix]="s.suffix ?? ''" /></dd>
          <dt class="t-label order-2">{{ s.label }}</dt>
        </div>
        <div class="divider" appInView [style.--d]="i * 0.12 + 's'"></div>
      </div>
    }
  </dl>`,
})
export class Stats {
  protected readonly stats = stats;
}

@Component({
  selector: 'app-expertise-list',
  imports: [InViewDirective],
  template: `<ul class="m-0 flex list-none flex-col gap-2 p-0">
    @for (e of items; track e.label; let i = $index) {
      <li class="reveal" appInView [style.--d]="i * 0.06 + 's'">
        <article class="flex min-h-[96px] items-stretch rounded-card justify-between gap-4 bg-gradient-to-b from-[#232323] to-[#1d1d1d] p-[14px] md:min-h-[126px]">
          <div class="flex flex-col justify-center">
            <p class="t-label-sm m-0 text-muted">{{ e.label }}</p>
            <h3 class="t-h3 mt-2 text-[19px] md:text-[21px]">{{ e.title }}</h3>
            <p class="t-small mt-2 max-w-[470px] text-soft">{{ e.text }}</p>
          </div>
          <div class="flex size-[72px] shrink-0 flex-col items-center justify-center gap-2.5 self-center rounded-card bg-[#141414] p-2.5 md:size-[106px] md:p-4">
            @for (l of e.logos; track l.src) {
              <img
                [src]="l.src"
                [alt]="l.name"
                [width]="l.w"
                [height]="l.h"
                loading="lazy"
                class="w-auto max-w-full object-contain"
                [style.max-height]="e.logos.length > 1 ? '30%' : '46%'"
              />
            }
          </div>
        </article>
      </li>
    }
  </ul>`,
})
export class ExpertiseList {
  protected readonly items = expertise;
}

@Component({
  selector: 'app-testimonials',
  imports: [Icon],
  template: `<div class="relative">
    <ul
      #track
      (scroll)="sync()"
      class="no-scrollbar mask-fade-r m-0 flex list-none snap-x snap-mandatory gap-2 overflow-x-auto p-0 lg:-mr-[calc(var(--gutter)+224px)] lg:pr-24"
      aria-label="Testimonios"
    >
      @for (t of items; track $index) {
        <li class="flex min-h-[206px] w-[85%] shrink-0 snap-start flex-col rounded-card justify-between bg-gradient-to-b from-[#232323] to-[#1d1d1d] p-[21px] md:w-[354px]">
          <span class="h-[16px] text-[13px] font-semibold leading-[16px] tracking-[0.05em] text-soft">{{ t.logo }}</span>
          <blockquote class="t-quote m-0 my-4">“{{ t.quote }}”</blockquote>
          <footer>
            <p class="t-small m-0 text-ink">{{ t.name }}</p>
            <p class="t-label-sm m-0 mt-1.5 text-muted">{{ t.role }}</p>
          </footer>
        </li>
      }
    </ul>
    <button
      type="button"
      (click)="next()"
      [disabled]="atEnd()"
      [attr.aria-label]="ui.next"
      class="absolute right-0 top-1/2 hidden -translate-y-1/2 p-3 opacity-60 transition-opacity hover:opacity-100 disabled:cursor-default disabled:opacity-30 md:block lg:-right-[calc(var(--gutter)+224px-48px)]"
    >
      <app-icon name="chevron-right" [size]="14" />
    </button>
  </div>`,
})
export class TestimonialsCarousel {
  protected readonly items = testimonials;
  protected readonly ui = ui;
  protected readonly atEnd = signal(false);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  constructor() {
    afterNextRender(() => this.sync());
  }

  protected sync() {
    const el = this.track().nativeElement;
    this.atEnd.set(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  protected next() {
    const el = this.track().nativeElement;
    const card = el.querySelector('li');
    if (card) el.scrollBy({ left: card.getBoundingClientRect().width + 8, behavior: 'smooth' });
  }
}

@Component({
  selector: 'app-logo-marquee',
  imports: [InViewDirective],
  template: `<div class="marquee mask-fade-x overflow-hidden" appInView margin="0px" aria-label="Clientes">
    <ul class="marquee-track m-0 list-none p-0">
      @for (n of list; track $index) {
        <li class="flex h-10 shrink-0 items-center px-9 opacity-60">
          <img [src]="n.src" [alt]="n.name" [width]="n.w" [height]="n.h" [style.height.px]="n.dh" class="w-auto" loading="eager" />
        </li>
      }
    </ul>
  </div>`,
})
export class LogoMarquee {
  protected readonly list = [...clientLogos, ...clientLogos];
}

@Component({
  selector: 'app-experience-timeline',
  imports: [InViewDirective],
  template: `<div class="relative">
    <span aria-hidden="true" class="absolute bottom-0 top-0 w-px bg-line max-lg:left-[27px] lg:right-[27px]"></span>
    <span #fill aria-hidden="true" class="absolute bottom-0 top-0 w-px origin-top scale-y-0 bg-white/60 max-lg:left-[27px] lg:right-[27px]"></span>
    <ol #list class="m-0 list-none p-0">
      @for (item of items; track item.title) {
        <li class="dim-item relative pb-[130px] last:pb-0 max-lg:pl-[78px] lg:pr-[84px]" appInView margin="0px 0px -50% 0px">
          <span
            aria-hidden="true"
            class="absolute top-0 flex size-[54px] items-center justify-center rounded-full bg-node text-[15px] font-semibold max-lg:left-0 lg:right-0"
            >{{ item.mark }}</span
          >
          <div class="max-w-[400px]">
            <p class="t-label-sm m-0 text-muted">{{ item.period }}</p>
            <h3 class="mt-2.5 text-[clamp(21px,1.8vw,25px)] font-medium leading-[1.2] tracking-[-0.02em]">{{ item.title }}</h3>
            @if (item.location) {
              <p class="mt-2 text-[14px] text-muted">{{ item.location }}</p>
            }
            <p class="t-small mt-3.5 text-ink">{{ item.text }}</p>
          </div>
        </li>
      }
    </ol>
  </div>`,
})
export class ExperienceTimeline {
  protected readonly items = experience;
  private readonly fill = viewChild.required<ElementRef<HTMLElement>>('fill');
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const fill = this.fill().nativeElement;
      if (reduced()) {
        fill.style.transform = 'scaleY(1)';
        return;
      }
      const stop = scroll(
        (p: number) => (fill.style.transform = `scaleY(${p})`),
        { target: this.list().nativeElement, offset: ['start 0.55', 'end 0.55'] },
      );
      destroyRef.onDestroy(stop);
    });
  }
}

@Component({
  selector: 'app-contact-rows',
  imports: [Icon, InViewDirective],
  template: `<ul class="m-0 list-none p-0">
    @for (s of items; track s.id; let i = $index) {
      <li>
        <a
          [href]="s.href"
          [attr.target]="s.external ? '_blank' : null"
          [attr.rel]="s.external ? 'noopener noreferrer' : null"
          class="group grid min-h-9 grid-cols-[1fr_auto] items-center gap-x-4 py-2.5 transition-colors hover:text-accent md:grid-cols-[222px_1fr_auto] md:py-0"
        >
          <span class="col-span-2 mb-0.5 text-[13px] font-medium uppercase text-muted md:col-span-1 md:mb-0">({{ s.label }})</span>
          <span class="text-[16px] font-medium">{{ s.display }}</span>
          <app-icon name="arrow-up-right" class="transition-transform duration-200 group-hover:-translate-y-[3px] group-hover:translate-x-[3px]" />
        </a>
        <div class="divider" appInView [style.--d]="i * 0.08 + 's'"></div>
      </li>
    }
  </ul>`,
})
export class ContactRows {
  protected readonly items = socials;
}
