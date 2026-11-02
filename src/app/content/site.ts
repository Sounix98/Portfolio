/**
 * Textos globales de la interfaz. Todo el sitio está en español;
 * para pasar a inglés basta con reemplazar los valores de `ui` (versión en inglés pendiente).
 * Fuente de contenido: portfolio-kit/GUIA_PORTAFOLIO.md
 */
export const site = {
  name: 'Sounix Romero',
  brand: 'SOUNIX',
  role: 'Diseñador Gráfico & UX/UI',
  location: 'Puerto Ordaz',
  email: 'sounixromero@gmail.com',
  phone: '+58 414 881 2017',
  whatsapp: 'https://wa.me/584148812017',
  year: 2026,
  description:
    'Portafolio de Sounix Romero: diseñador gráfico y UX/UI en Puerto Ordaz, Venezuela. Identidades, campañas e interfaces que diseño y programo.',
  heroSubtitle:
    'Diseño marcas con carácter y productos digitales que se entienden. De la identidad visual a la interfaz en código.',
  worksDescription:
    'Identidades, campañas, catálogos e interfaces. De mi marca propia a proyectos para clientes en Venezuela, Puerto Rico y Latinoamérica.',
  statement:
    'Soy Sounix Romero, diseñador gráfico y UX/UI en Puerto Ordaz, Venezuela. Llevo 10 años creando identidades, campañas y, hoy, interfaces que diseño y programo con apoyo de IA.',
  statementParagraph:
    'Empecé diseñando antes de graduarme y no he parado. Pasé por pantallas LED de eventos masivos, campañas para Mercado Libre y TuCarro, y marcas de streetwear con identidad propia. Hoy diseño y programo productos digitales en VEXBIZ.',
} as const;

export const ui = {
  nav: { works: 'TRABAJOS', about: 'SOBRE MÍ', contact: 'CONTACTO', menu: 'MENÚ', close: 'CERRAR' },
  allWorks: 'TODOS LOS TRABAJOS',
  details: 'DETALLES',
  premise: 'EL RETO',
  process: 'PROCESO',
  client: 'CLIENTE',
  year: 'AÑO',
  role: 'ROL',
  type: 'TIPO',
  links: 'ENLACES',
  nextProject: 'Siguiente proyecto',
  expertise: 'MI EXPERTISE',
  clients: 'CLIENTES SELECCIONADOS',
  experience: 'EXPERIENCIA',
  contact: 'HABLEMOS',
  grid: 'Grid',
  full: 'Full',
  view: 'Vista',
  next: 'Siguiente',
} as const;

export const routes = {
  home: '/',
  about: '/sobre-mi',
  works: '/trabajos',
  work: (slug: string) => `/trabajos/${slug}`,
} as const;
