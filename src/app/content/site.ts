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
