import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export type Phase = 'covered' | 'covering' | 'revealing' | 'idle';

const COVER_MS = 900;
const REDUCED_MS = 220;

/** Estado de las persianas (loader inicial y cambio de ruta) y de la URL actual. */
@Injectable({ providedIn: 'root' })
export class TransitionService {
  private readonly router = inject(Router);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private pending = false;

  /** Empieza cubierto: es el fondo del loader. */
  readonly phase = signal<Phase>('covered');
  readonly released = signal(false);
  readonly url = signal('/');

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.url.set(e.urlAfterRedirects));
  }

  private get ms() {
    return this.browser && matchMedia('(prefers-reduced-motion: reduce)').matches ? REDUCED_MS : COVER_MS;
  }

  /** Descubre la pantalla (persianas hacia abajo). */
  reveal() {
    this.phase.set('revealing');
    setTimeout(() => this.phase.set('idle'), this.ms);
  }

  /** Termina el loader inicial. */
  release() {
    this.released.set(true);
    this.reveal();
  }

  /** Cubre, navega, vuelve arriba y descubre la nueva página. */
  navigate(url: string) {
    if (this.pending || url === this.url()) return;
    this.pending = true;
    this.phase.set('covering');
    setTimeout(async () => {
      await this.router.navigateByUrl(url);
      window.scrollTo(0, 0);
      this.phase.set('covered');
      setTimeout(() => {
        this.pending = false;
        this.reveal();
      }, 80);
    }, this.ms);
  }
}
