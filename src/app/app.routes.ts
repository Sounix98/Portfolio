import { ResolveFn, Routes } from '@angular/router';
import { getProject } from './content/projects';
import { site } from './content/site';

const suffix = ` — ${site.name}`;

const caseTitle: ResolveFn<string> = (route) => {
  const project = getProject(route.paramMap.get('slug') ?? '');
  return (project?.title ?? 'No encontrado') + suffix;
};

export const routes: Routes = [
  { path: '', title: `${site.name} — ${site.role}`, loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'sobre-mi', title: 'Sobre mí' + suffix, loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'trabajos', title: 'Trabajos' + suffix, loadComponent: () => import('./pages/works').then((m) => m.Works) },
  { path: 'trabajos/:slug', title: caseTitle, loadComponent: () => import('./pages/case').then((m) => m.Case) },
  { path: '**', title: '404' + suffix, loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
