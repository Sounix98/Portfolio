import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { site, ui } from '../../content/site';
import { testimonials } from '../../content/testimonials';
import { Footer } from '../../layout/footer';
import {
  ContactRows,
  ExperienceTimeline,
  ExpertiseList,
  LogoMarquee,
  StatementReveal,
  Stats,
  TestimonialsCarousel,
} from './sections';

@Component({
  selector: 'app-about',
  imports: [
    NgOptimizedImage,
    Footer,
    StatementReveal,
    Stats,
    ExpertiseList,
    TestimonialsCarousel,
    LogoMarquee,
    ExperienceTimeline,
    ContactRows,
  ],
  template: `
    <main class="px-[var(--gutter)]">
      <div class="flex items-stretch">
        <div class="w-full pt-28 lg:w-[48.5%] lg:min-w-0">
          <section aria-labelledby="about-title">
            <app-statement-reveal headingId="about-title" [text]="site.statement" />
            <p class="mt-[clamp(56px,8vw,120px)] max-w-[420px] text-[16px] leading-[1.55] text-soft">
              {{ site.statementParagraph }}
            </p>
          </section>

          <div class="relative mt-12 aspect-[4/5] w-full overflow-hidden md:ml-auto md:aspect-[9/10] md:w-[60%] lg:hidden rounded-panel">
            <img ngSrc="/images/about/sounix-retrato.webp" fill sizes="100vw" class="object-cover object-[50%_22%]" [alt]="'Retrato de ' + site.name" />
          </div>

          <section aria-label="Cifras" class="mt-8 max-w-[655px]">
            <app-stats />
          </section>

          <section aria-labelledby="expertise-title" class="mt-[clamp(110px,14vw,200px)] max-w-[655px]">
            <h2 id="expertise-title" class="t-h2 mb-6">{{ ui.expertise }}</h2>
            <app-expertise-list />
          </section>

          <section aria-labelledby="clients-title" class="mt-[clamp(110px,14vw,200px)]">
            <h2 id="clients-title" class="t-h2 mb-6">{{ ui.clients }}</h2>
            @if (hasTestimonials) {
              <app-testimonials />
            }
            <div class="mt-16 max-w-[655px] lg:-mr-12"><app-logo-marquee /></div>
          </section>

          <section aria-labelledby="experience-title" class="mt-[clamp(110px,14vw,200px)] max-w-[655px]">
            <h2 id="experience-title" class="t-h2 mb-10">{{ ui.experience }}</h2>
            <app-experience-timeline />
          </section>

          <section aria-labelledby="contact-title" class="mb-[clamp(110px,14vw,200px)] mt-[clamp(110px,14vw,200px)] max-w-[655px]">
            <h2 id="contact-title" class="t-h2 mb-6">{{ ui.contact }}</h2>
            <app-contact-rows />
          </section>
        </div>

        <div class="relative hidden flex-1 pt-28 lg:block">
          <div class="sticky top-28 ml-auto w-[min(432px,100%)]">
            <div class="relative aspect-[9/10] overflow-hidden rounded-panel">
              <img ngSrc="/images/about/sounix-retrato.webp" fill priority sizes="30vw" class="object-cover object-[50%_22%]" [alt]="'Retrato de ' + site.name" />
            </div>
          </div>
        </div>
      </div>
    </main>
    <app-footer [logoBand]="true" />
  `,
})
export class About {
  protected readonly site = site;
  protected readonly ui = ui;
  protected readonly hasTestimonials = testimonials.length > 0;
}
