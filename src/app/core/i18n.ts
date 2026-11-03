import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { experience } from '../content/experience';
import { expertise, stats } from '../content/expertise';
import { experienceEn, expertiseEn, siteEn, statsEn, uiEn } from '../content/en';
import { projects, type Pic, type Project } from '../content/projects';
import { phrasesEn, projectsEn } from '../content/projects.en';
import { site, ui } from '../content/site';

export type Lang = 'es' | 'en';

const STORAGE_KEY = 'sx-lang';

/** Devuelve una copia del proyecto con los textos en inglés (americano). Las rutas e imágenes no cambian. */
function localize(p: Project): Project {
  const t = projectsEn[p.slug];
  if (!t) return p;
  const ph = (s: string) => phrasesEn[s] ?? s;
  const pic = (x: Pic): Pic => ({ ...x, alt: x.alt === p.title ? t.title : ph(x.alt) });
  return {
    ...p,
    ...t,
    links: p.links?.map((l) => ({ ...l, label: ph(l.label) })),
    cover: pic(p.cover),
    heroSlides: p.heroSlides?.map(pic),
    heroLogos: p.heroLogos?.map(pic),
    heroBackdrop: p.heroBackdrop ? pic(p.heroBackdrop) : undefined,
    thumb: pic(p.thumb),
    gallery: p.gallery.map(pic),
    galleryGroups: p.galleryGroups?.map((g) => ({ title: ph(g.title), images: g.images.map(pic) })),
  };
}

const projectsByLang: Record<Lang, Project[]> = { es: projects, en: projects.map(localize) };

/** Idioma activo (es por defecto) y todo el contenido ya resuelto en ese idioma. */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly doc = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Siempre arranca en `es` (coincide con el HTML prerenderizado); `init()` aplica la preferencia ya en el navegador. */
  readonly lang = signal<Lang>('es');

  readonly site = computed(() => (this.lang() === 'en' ? siteEn : site));
  readonly ui = computed(() => (this.lang() === 'en' ? uiEn : ui));
  readonly expertise = computed(() => (this.lang() === 'en' ? expertiseEn : expertise));
  readonly stats = computed(() => (this.lang() === 'en' ? statsEn : stats));
  readonly experience = computed(() => (this.lang() === 'en' ? experienceEn : experience));
  readonly projects = computed(() => projectsByLang[this.lang()]);

  constructor() {
    effect(() => {
      this.doc.documentElement.lang = this.lang();
      this.meta.updateTag({ name: 'description', content: this.site().description });
    });
  }

  project(slug: string) {
    return this.projects().find((p) => p.slug === slug);
  }

  nextProject(slug: string) {
    const list = this.projects();
    const i = list.findIndex((p) => p.slug === slug);
    return list[(i + 1) % list.length];
  }

  set(lang: Lang) {
    this.lang.set(lang);
    if (!this.browser) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* almacenamiento bloqueado: el idioma vale solo para esta visita */
    }
  }

  /** En el navegador: `?lang=en` (enlace para compartir) manda sobre lo guardado. */
  init() {
    if (!this.browser) return;
    let next: Lang | null = null;
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'es') next = q;
    else {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'en' || saved === 'es') next = saved;
      } catch {
        /* sin almacenamiento */
      }
    }
    if (next && next !== this.lang()) this.set(next);
  }
}

const PAGE_TITLES: Record<string, Record<Lang, string>> = {
  about: { es: 'Sobre mí', en: 'About' },
  works: { es: 'Trabajos', en: 'Work' },
  notFound: { es: '404', en: '404' },
};

/** Título de pestaña según ruta e idioma; se recalcula al cambiar de idioma. */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18n);
  private snapshot: RouterStateSnapshot | null = null;

  constructor() {
    super();
    effect(() => {
      this.i18n.lang();
      if (this.snapshot) this.apply(this.snapshot);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.snapshot = snapshot;
    this.apply(snapshot);
  }

  private apply(snapshot: RouterStateSnapshot) {
    let route: ActivatedRouteSnapshot = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const key = route.data['page'] as string | undefined;
    const lang = this.i18n.lang();
    const s = this.i18n.site();
    const suffix = ` — ${s.name}`;
    if (key === 'home') return this.title.setTitle(`${s.name} — ${s.role}`);
    if (key === 'case') {
      const p = this.i18n.project(route.paramMap.get('slug') ?? '');
      return this.title.setTitle((p?.title ?? this.i18n.ui().aria.notFoundTitle) + suffix);
    }
    this.title.setTitle((key ? PAGE_TITLES[key][lang] : '404') + suffix);
  }
}
