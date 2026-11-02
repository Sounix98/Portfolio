import { RenderMode, ServerRoute } from '@angular/ssr';
import { projects } from './content/projects';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'trabajos/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => projects.map((p) => ({ slug: p.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
