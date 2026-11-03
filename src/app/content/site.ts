/**
 * Textos globales de la interfaz (español, idioma por defecto).
 * La versión en inglés americano vive en `en.ts`; el idioma activo lo decide `I18n` (ver `core/i18n.ts`).
 * Fuente de contenido: portfolio-kit/GUIA_PORTAFOLIO.md
 */
export type SiteCopy = {
  name: string;
  brand: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  year: number;
  description: string;
  heroSubtitle: string;
  worksDescription: string;
  statement: string;
  statementSubtitle: string;
  statementParagraph: string;
  contactIntro: string;
};

export type UiCopy = {
  nav: { works: string; about: string; contact: string; menu: string; close: string };
  allWorks: string;
  details: string;
  premise: string;
  process: string;
  client: string;
  year: string;
  role: string;
  type: string;
  links: string;
  nextProject: string;
  expertise: string;
  clients: string;
  experience: string;
  contact: string;
  grid: string;
  full: string;
  view: string;
  next: string;
  basedIn: string;
  notFound: string;
  backHome: string;
  aria: {
    main: string;
    mobileMenu: string;
    homeSuffix: string;
    projects: string;
    gallery: string;
    figures: string;
    testimonials: string;
    clients: string;
    social: string;
    loading: string;
    language: string;
    notFoundTitle: string;
  };
};

export const site: SiteCopy = {
  name: 'Sounix Romero',
  brand: 'SOUNIX',
  role: 'Diseñador Gráfico & UX/UI',
  location: 'Puerto Ordaz',
  email: 'sounixromero@gmail.com',
  phone: '+58 414 881 2017',
  whatsapp: 'https://wa.me/584148812017',
  year: 2026,
  description:
    'Diseño marcas y productos digitales. Y los llevo a código. Sounix Romero, diseñador y director de arte en Puerto Ordaz, Venezuela · trabajo remoto.',
  heroSubtitle:
    'Diseño marcas con carácter y productos digitales que se entienden. De la identidad visual a la interfaz en código.',
  worksDescription:
    'Identidades, campañas, catálogos e interfaces. De mi marca propia a proyectos para clientes en Venezuela, Puerto Rico y Latinoamérica.',
  statement: 'Diseño marcas y productos digitales. Y los llevo a código.',
  statementSubtitle: 'Sounix Romero — diseñador y director de arte. Puerto Ordaz, Venezuela · trabajo remoto.',
  statementParagraph:
    'Llevo 10 años diseñando piezas que tienen que funcionar en el mundo real: pantallas LED en eventos masivos, campañas de prevención de estafas para Mercado Libre, marcas de streetwear que viven en la calle. Hoy llevo esa exigencia a producto: en VEXBIZ rediseñé el flujo de compra y venta y lo construyo en Angular.',
  contactIntro: 'Abierto a roles de producto en remoto y a proyectos de marca. Escríbeme por donde prefieras.',
};

export const ui: UiCopy = {
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
  basedIn: 'BASADO EN',
  notFound: 'Esta página no existe.',
  backHome: 'VOLVER AL INICIO',
  aria: {
    main: 'Principal',
    mobileMenu: 'Menú móvil',
    homeSuffix: ' — inicio',
    projects: 'proyectos',
    gallery: 'Galería',
    figures: 'Cifras',
    testimonials: 'Testimonios',
    clients: 'Clientes',
    social: 'Redes',
    loading: 'Cargando',
    language: 'Idioma',
    notFoundTitle: 'No encontrado',
  },
};

export const routes = {
  home: '/',
  about: '/sobre-mi',
  works: '/trabajos',
  work: (slug: string) => `/trabajos/${slug}`,
} as const;
