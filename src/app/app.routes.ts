import { Routes } from '@angular/router';

// El título de cada ruta lo resuelve `AppTitleStrategy` (core/i18n.ts) según `data.page` y el idioma activo.
export const routes: Routes = [
  { path: '', data: { page: 'home' }, loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'sobre-mi', data: { page: 'about' }, loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'trabajos', data: { page: 'works' }, loadComponent: () => import('./pages/works').then((m) => m.Works) },
  { path: 'trabajos/:slug', data: { page: 'case' }, loadComponent: () => import('./pages/case').then((m) => m.Case) },
  { path: '**', data: { page: 'notFound' }, loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
