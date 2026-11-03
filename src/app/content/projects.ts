import { media } from './media';

/** Imagen con dimensiones reales (generadas por `npm run images`). */
export type Pic = { src: string; w: number; h: number; alt: string };

export type ProcessStep = { title: string; text: string };

export type Project = {
  slug: string;
  title: string;
  /** Año o rango, p. ej. "2024" o "2019–2023". */
  year: string;
  category: string;
  /** Máx. 55 caracteres. */
  tagline: string;
  /** Etiqueta opcional: "Proyecto conceptual", "Marca propia"… */
  label?: string;
  client: string;
  role: string;
  /** Contexto del proyecto (párrafo de entrada). */
  intro: string;
  /** Reto, solución y resultado. */
  premise: { title: string; paragraphs: string[] };
  process: ProcessStep[];
  links?: { label: string; url: string }[];
  cover: Pic;
  /** Miniatura fija (hero, Trabajos y «Siguiente proyecto»): elegida por afinidad con el look de la web. */
  thumb: Pic;
  gallery: Pic[];
  /** Si existe, la galería se muestra agrupada con un título por grupo. */
  galleryGroups?: { title: string; images: Pic[] }[];
};

const PLACEHOLDER = { src: '/images/_placeholder.svg', w: 1600, h: 900 };

/** `key` = ruta dentro de portfolio-kit/assets sin extensión, p. ej. "ntac/ntac-logo-verde". */
function pic(key: string, alt: string): Pic {
  const m = media[key];
  if (!m) {
    // TODO: imagen pendiente (ver GUIA_PORTAFOLIO.md, sección 11).
    return { ...PLACEHOLDER, alt };
  }
  return { src: `/images/${key}.webp`, w: m.w, h: m.h, alt };
}

type Seed = Omit<Project, 'cover' | 'thumb' | 'gallery' | 'galleryGroups'> & {
  cover: string;
  /** [clave, alt] de la miniatura; si falta, se usa la portada. */
  hero?: [string, string];
  gallery: [string, string][]; // [clave, alt]
  groups?: { title: string; items: [string, string][] }[];
};

const project = ({ cover, hero, gallery, groups, ...seed }: Seed): Project => {
  const galleryGroups = groups?.map((g) => ({ title: g.title, images: g.items.map(([k, alt]) => pic(k, alt)) }));
  return {
    ...seed,
    cover: pic(cover, seed.title),
    thumb: hero ? pic(hero[0], hero[1]) : pic(cover, seed.title),
    gallery: galleryGroups ? galleryGroups.flatMap((g) => g.images) : gallery.map(([k, alt]) => pic(k, alt)),
    galleryGroups,
  };
};

export const projects: Project[] = [
  project({
    slug: 'vexbiz-marketplace',
    title: 'VEXBIZ Marketplace',
    year: '2026',
    category: 'UX/UI y frontend',
    tagline: 'Un marketplace B2B más claro, llevado a código.',
    client: 'VEXBIZ',
    role: 'UX/UI, dirección de arte y frontend',
    intro:
      'VEXBIZ es un marketplace B2B que reúne tiendas verificadas de refrigeración, automotriz, ferretería, farmacias, industrial, paneles solares y más, con pago protegido hasta la entrega.',
    premise: {
      title: 'Hacer claro el flujo de compra y venta',
      paragraphs: [
        'El flujo de compra y venta era poco claro y la app se sentía poco amigable para los negocios que la usan.',
        'La solución es una interfaz más clara y cercana, con navegación por categorías, tiendas verificadas y un checkout simplificado.',
        // TODO: pedir métricas de VEXBIZ si existen (tiendas activas, productos publicados, tiempo de compra).
      ],
    },
    process: [
      { title: 'Revisión del flujo', text: 'Revisé el flujo de compra y venta para darle claridad y mejor usabilidad.' },
      { title: 'Arquitectura con IT', text: 'Definí con el departamento de IT las categorías, las vistas principales y las funciones del checkout.' },
      { title: 'Diseño a código', text: 'Llevé el diseño directamente a código en Angular, con apoyo de IA.' },
    ],
    links: [
      { label: 'Marketplace', url: 'https://sounix98.github.io/vexbiz-marketplace/#/inicio' },
      { label: 'Desktop', url: 'https://sounix98.github.io/VEXBIZ-DESKTOP-1/#/inicio' },
    ],
    cover: 'vexbiz/vexbiz-furgoneta-trasera',
    hero: ['vexbiz/vexbiz-marca-oscura', 'VEXBIZ: wordmark sobre fondo de red'],
    gallery: [],
    groups: [
      {
        title: 'App móvil',
        items: [
          ['vexbiz/vexbiz-app-01-descubrir', 'Marketplace VEXBIZ en móvil: inicio, categorías y página de nicho de Refrigeración'],
          ['vexbiz/vexbiz-app-02-comprar', 'Marketplace VEXBIZ en móvil: producto, carrito y entrega y pago'],
          ['vexbiz/vexbiz-app-03-cuenta-y-nichos', 'Marketplace VEXBIZ en móvil: inicio de sesión, cuenta y nicho Automotriz en tema claro'],
          ['vexbiz/vexbiz-app-04-claro-y-oscuro', 'Marketplace VEXBIZ en móvil: inicio y producto en tema claro y oscuro'],
        ],
      },
      {
        title: 'Marca y contexto',
        items: [
          ['vexbiz/vexbiz-furgoneta-lateral', 'Furgoneta de VEXBIZ Suministros recorriendo una avenida al atardecer'],
          ['vexbiz/vexbiz-wordmark-claro', 'Wordmark de VEXBIZ en relieve sobre fondo claro'],
          ['vexbiz/vexbiz-marca-oscura', 'Wordmark de VEXBIZ sobre fondo azul oscuro con red de puntos'],
          ['vexbiz/vexbiz-calle-palmeras', 'Furgoneta de VEXBIZ en una calle con palmeras'],
        ],
      },
    ],
  }),
  project({
    slug: 'ntac',
    title: 'NTAC',
    year: '2021',
    category: 'Dirección creativa',
    tagline: 'Mi marca de streetwear: identidad, merch y tienda online.',
    label: 'Marca propia',
    client: 'NTAC (marca propia)',
    role: 'Dirección creativa, identidad, ilustración, UX y frontend',
    intro:
      'NTAC (Never Trust A Cop) es mi marca de streetwear y graffiti desde Puerto Ordaz: prendas oversized de algodón 220 g intervenidas con stencil, tinta textil y curado a mano.',
    premise: {
      title: 'Una marca con actitud propia, también online',
      paragraphs: [
        'Quería crear una marca con actitud propia y una experiencia online coherente con ella: que la web se sintiera como la calle de la que viene la ropa.',
        'El resultado es un sistema visual completo: logotipo ovalado en lettering, el personaje de la ilustración «Le monde est à vous», una colección 2026/2027 con ilustraciones propias («La prisa nos esclaviza», «El dolor no se fue», «Crecer»), dirección de arte para el lookbook y una tienda online con su propio look & feel.',
        'La marca está activa desde 2021 y tiene su colección 2026/2027 en preventa. La tienda es un prototipo navegable: precios, stock y envíos son datos provisionales.',
      ],
    },
    process: [
      { title: 'Identidad', text: 'Logotipo ovalado en lettering, personaje e ilustración «Le monde est à vous», pensados para sellos, etiquetas y prendas.' },
      { title: 'Colección y lookbook', text: 'Ilustraciones por prenda, fotografía de producto y retratos urbanos con una dirección de color propia: verde ácido sobre negro y teal.' },
      { title: 'Web: lenguaje visual', text: 'Fondo oscuro, verde ácido como único acento y titulares condensados en mayúsculas, con texto en contorno, cintas de precaución y fotos con borde de papel rasgado.' },
      { title: 'Web: flujo', text: 'Cinta de mensajes y hero con el lema; drop de la colección en galería de paneles; productos disponibles; manifiesto; pilares; y un cierre «Comenta NTAC» que lleva a Instagram.' },
    ],
    links: [{ label: 'Sitio', url: 'https://sounix98.github.io/NTAC-PAGE-/' }],
    cover: 'ntac/ntac-branding-2022',
    hero: ['ntac/photo_2025-10-18_22-35-46', 'Lookbook NTAC: calle de noche'],
    gallery: [],
    groups: [
      {
        title: 'LA WEB · FLUJO Y LOOK & FEEL',
        items: [
          ['ntac/web/ntac-web-01-hero', 'Web de NTAC: hero «Never Trust A Cop» con cinta de mensajes'],
          ['ntac/web/ntac-web-02-cinta-y-drop', 'Web de NTAC: cintas de precaución y encabezado del drop «Cada pieza, un megáfono»'],
          ['ntac/web/ntac-web-03-galeria-y-disponible', 'Web de NTAC: galería de paneles del drop y sección «Disponible ahora»'],
          ['ntac/web/ntac-web-04-productos', 'Web de NTAC: tarjetas de producto con precio, descripción y variantes'],
          ['ntac/web/ntac-web-05-manifiesto', 'Web de NTAC: manifiesto con tipografía gigante y fotos con borde rasgado'],
          ['ntac/web/ntac-web-06-pilares', 'Web de NTAC: pilares sobre fondo verde ácido'],
          ['ntac/web/ntac-web-07-comenta-ntac', 'Web de NTAC: cierre «Comenta NTAC» con fotos dispersas'],
        ],
      },
      {
        title: 'IDENTIDAD',
        items: [
          ['ntac/ntac-branding-2022', 'Lámina de branding de NTAC: logotipo, personaje y camisetas'],
          ['ntac/ntac-logo-verde', 'Logotipo de NTAC en verde'],
        ],
      },
      {
        title: 'LOOKBOOK',
        items: [
          ['ntac/photo_2025-10-18_22-35-47-4', 'Lookbook NTAC: camiseta «Le monde est à vous» en un skatepark'],
          ['ntac/photo_2025-10-18_22-35-47-3', 'Lookbook NTAC: pasillo de supermercado'],
          ['ntac/photo_2025-10-18_22-35-46', 'Lookbook NTAC: calle de noche'],
          ['ntac/photo_2025-10-18_22-35-47-2', 'Lookbook NTAC: logotipo gigante sobre un edificio'],
          ['ntac/photo_2025-10-18_22-35-47', 'Lookbook NTAC: camiseta con óvalo NTAC en una escalera'],
          ['ntac/photo_2026-11-02_15-39-13', 'Lookbook NTAC: dos modelos en una estación de servicio'],
        ],
      },
      {
        title: 'COLECCIÓN 2026/2027',
        items: [
          ['ntac/artboard-1', 'Colección 2026/2027: «La prisa nos esclaviza» en camiseta negra'],
          ['ntac/artboard-2', 'Colección 2026/2027: espalda de «La prisa nos esclaviza»'],
          ['ntac/2', 'Colección 2026/2027: «La prisa nos esclaviza», camiseta blanca'],
          ['ntac/bavk', 'Colección 2026/2027: «La prisa nos esclaviza», espalda en camiseta crema'],
          ['ntac/front', 'Colección 2026/2027: frente de la camiseta crema'],
          ['ntac/artboard-3', 'Colección 2026/2027: «El dolor no se fue»'],
          ['ntac/artboard-4', 'Colección 2026/2027: ilustración «Naturaleza»'],
          ['ntac/artboard-5', 'Colección 2026/2027: «Naturaleza», retrato'],
          ['ntac/artboard-6', 'Colección 2026/2027: «Naturaleza», espalda'],
        ],
      },
      {
        title: 'CRECER',
        items: [
          ['ntac/crecer', 'Diseño «Crecer»: camiseta blanca en percha'],
          ['ntac/crecer2', 'Diseño «Crecer»: espalda en un ascensor'],
          ['ntac/crecer3', 'Diseño «Crecer»: camiseta en alto'],
        ],
      },
      {
        title: 'DISEÑOS ESPECIALES',
        items: [
          ['ntac/spiderman2', 'Diseño «Your Friendly Neighbour»: espalda'],
          ['ntac/spiderman4', 'Diseño «Your Friendly Neighbour» en percha'],
          ['ntac/spiderman3', 'Diseño «Great Power»'],
        ],
      },
      {
        title: 'TALLER Y STENCIL',
        items: [
          ['ntac/img_2263', 'Prendas NTAC estampadas sobre el suelo del taller'],
          ['ntac/img_2267', 'Detalle de estampado en tinta textil'],
          ['ntac/img_2269', 'Detalle del estampado «Le monde est à vous» sobre tela'],
        ],
      },
    ],
  }),
  project({
    slug: 'ledco',
    title: 'LEDCO',
    year: '2019–2023',
    category: 'Editorial y redes',
    tagline: 'Catálogo técnico y campaña para pantallas LED.',
    client: 'LEDCO (Puerto Rico)',
    role: 'Diseñador gráfico, remoto',
    intro:
      'LEDCO (antes LED Factory) es una empresa de Puerto Rico que vende pantallas LED indoor y outdoor y televisores para exteriores. Su lema: «Create your Vision».',
    premise: {
      title: 'Una línea técnica, explicada con claridad',
      paragraphs: [
        'Había que presentar una línea técnica amplia, de 13 modelos, de forma clara y atractiva para el mercado estadounidense y puertorriqueño, en inglés.',
        'Diseñé el catálogo de productos (1920×1080, en inglés): portada, «Why LEDCO», stock y una ficha por modelo con foto de aplicación y tabla de especificaciones, además de páginas técnicas de ensamblaje, mantenimiento y diseños curvos.',
        'También la campaña en redes del PoolPRO QLED Full Outdoor TV, la identidad en Instagram, banners horizontales y piezas de la etapa LED Factory.',
      ],
    },
    process: [
      { title: 'Catálogo de productos', text: 'Una ficha por modelo con foto de aplicación y tabla de especificaciones.' },
      { title: 'Campaña PoolPRO QLED', text: 'Lanzamiento, beneficios, comparativa con TV tradicional, tamaños y CTA para pedir el catálogo por DM.' },
      { title: 'Identidad en Instagram', text: 'Íconos de highlights, post de logo y stories.' },
    ],
    cover: 'ledco/catalogo/catalogo-01',
    gallery: [
      ['ledco/catalogo/catalogo-01', 'Portada del catálogo de productos de LEDCO'],
      ['ledco/catalogo/catalogo-03', 'Página del catálogo de LEDCO'],
      ['ledco/catalogo/catalogo-06', 'Ficha de modelo del catálogo de LEDCO'],
      ['ledco/catalogo/catalogo-12', 'Ficha de modelo del catálogo de LEDCO'],
      ['ledco/catalogo/catalogo-20', 'Página técnica del catálogo de LEDCO'],
      ['ledco/catalogo/catalogo-30', 'Página del catálogo de LEDCO'],
      ['ledco/redes/poolpro-qled-01-lanzamiento', 'PoolPRO QLED: carrusel de lanzamiento'],
      ['ledco/redes/poolpro-qled-03-create-your-vision', 'PoolPRO QLED: Create your Vision'],
      ['ledco/redes/poolpro-qled-06-features', 'PoolPRO QLED: características'],
      ['ledco/redes/poolpro-qled-07-tamanos', 'PoolPRO QLED: tabla de tamaños'],
      ['ledco/redes/ig-highlights', 'Íconos de highlights de Instagram de LEDCO'],
      ['ledco/banners/ledco-banner-01', 'Banner horizontal PoolPRO QLED'],
      ['ledco/banners/ledco-banner-02', 'Banner horizontal PoolPRO QLED'],
      ['ledco/led-factory-outdoor-advertising', 'LED Factory: Outdoors Advertising'],
      ['ledco/homepower/homepower-flyer', 'Flyer para Home Power Sun Energy, cliente de LEDCO'],
    ],
  }),
  project({
    slug: 'la-festa-fest',
    title: 'La Festa Fest',
    year: '2025',
    category: 'Dirección creativa',
    tagline: 'Un festival que no existe, con identidad real.',
    label: 'Proyecto conceptual',
    client: 'Proyecto conceptual',
    role: 'Dirección creativa, identidad, ilustración y personajes',
    intro:
      'La Festa Fest es un festival musical ficticio, creado como ejercicio de dirección creativa.',
    premise: {
      title: 'La identidad completa de un evento',
      paragraphs: [
        'El reto fue construir la identidad completa de un evento con personalidad propia.',
        'Diseñé un logotipo en lettering «bubble», un key visual ilustrado con escenario y hormigas cargando la estructura, y tres personajes presentados como polaroids: FeStar (host), Skitt (graffiti writer) y Beatzzy (promotor). Hashtag: #ViveLaFesta.',
      ],
    },
    process: [
      { title: 'Logotipo', text: 'Lettering «bubble» con la fecha del evento.' },
      { title: 'Key visual', text: 'Escenario ilustrado con hormigas cargando la estructura.' },
      { title: 'Personajes', text: 'FeStar, Skitt y Beatzzy, presentados como polaroids.' },
    ],
    cover: 'la-festa-fest/la-festa-fest-key-visual',
    gallery: [
      ['la-festa-fest/la-festa-fest-key-visual', 'Key visual de La Festa Fest 2025'],
      ['la-festa-fest/la-festa-fest-logo', 'Logotipo de La Festa Fest'],
      ['la-festa-fest/personaje-festar-host', 'Personaje FeStar, host del evento'],
      ['la-festa-fest/personaje-skitt-graffiti-writer', 'Personaje Skitt, graffiti writer'],
      ['la-festa-fest/personaje-beatzzy-promotor', 'Personaje Beatzzy, promotor'],
    ],
  }),
  project({
    slug: 'zipo',
    title: 'ZIPO',
    year: '2024',
    category: 'Branding y merch',
    tagline: 'Lettering de fuego para una marca de calle.',
    label: 'Cliente recurrente',
    client: 'ZIPO',
    role: 'Identidad visual y diseño de merch',
    intro: 'ZIPO es un cliente recurrente desde 2024 que necesitaba una identidad con fuerza para su merch.',
    premise: {
      title: 'Una identidad que se lleva puesta',
      paragraphs: [
        'Diseñé un logotipo en lettering de fuego y lo apliqué a camisetas, gorras bordadas y un póster 2024.',
      ],
    },
    process: [
      { title: 'Lettering', text: 'Un logotipo en lettering de fuego, en versión negra y blanca.' },
      { title: 'Merch', text: 'Camisetas y gorras bordadas con la línea gráfica de la marca.' },
      { title: 'Póster 2024', text: 'Una pieza editorial que lleva el lettering a gran formato.' },
    ],
    cover: 'zipo/zipo-poster-2024',
    hero: ['zipo/zipo-merch-design', 'Diseño de merch de ZIPO'],
    gallery: [
      ['zipo/zipo-poster-2024', 'Póster ZIPO 2024'],
      ['zipo/zipo-merch-linea-grafica', 'Línea gráfica de merch de ZIPO'],
      ['zipo/zipo-merch-design', 'Diseño de merch de ZIPO'],
      ['zipo/zipo-logo-negro', 'Logotipo de ZIPO en negro'],
    ],
  }),
  project({
    slug: 'cafe-marketing',
    title: 'Campañas Café Marketing',
    year: '2025',
    category: 'Redes sociales',
    tagline: 'Carruseles que venden: tecnología, turismo y más.',
    client: 'Café Marketing',
    role: 'Diseñador y community manager',
    intro:
      'Durante 2025 fui diseñador y community manager en Café Marketing, con 5 cuentas de clientes locales.',
    premise: {
      title: 'Contenido para cuentas muy distintas',
      paragraphs: [
        'Diseñé contenido, carruseles y campañas para Nanologic (tecnología), D’Viajes (turismo) y la propia agencia.',
        'Nanologic: carrusel de Día del Padre, delivery gratis y servicio técnico con humor. D’Viajes: Plan Bad Bunny Medellín 2026 y rutas aéreas desde Puerto Ordaz. Café Marketing: planes y servicios («No lo dejes medio vacío… Llénalo y crece»).',
      ],
    },
    process: [
      { title: 'Nanologic', text: 'Carrusel Día del Padre, delivery gratis y servicio técnico.' },
      { title: 'D’Viajes', text: 'Plan Bad Bunny Medellín 2026 y rutas aéreas desde Puerto Ordaz.' },
      { title: 'Café Marketing', text: 'Campaña de planes y servicios de la propia agencia.' },
    ],
    cover: 'cafe-marketing/cafemkt-promo-01-llenalo-y-crece',
    hero: ['cafe-marketing/dviajes-plan-bad-bunny-01-portada', 'D’Viajes: Plan Bad Bunny, portada'],
    gallery: [
      ['cafe-marketing/nanologic-dia-del-padre-01-portada', 'Nanologic: portada del carrusel Día del Padre'],
      ['cafe-marketing/nanologic-dia-del-padre-02-laptops', 'Nanologic: laptops, Día del Padre'],
      ['cafe-marketing/nanologic-dia-del-padre-03-combos', 'Nanologic: combos, Día del Padre'],
      ['cafe-marketing/nanologic-dia-del-padre-04-all-in-one', 'Nanologic: all in one, Día del Padre'],
      ['cafe-marketing/nanologic-delivery-gratis', 'Nanologic: delivery gratis'],
      ['cafe-marketing/nanologic-servicio-tecnico-ex', 'Nanologic: servicio técnico'],
      ['cafe-marketing/dviajes-plan-bad-bunny-01-portada', 'D’Viajes: Plan Bad Bunny, portada'],
      ['cafe-marketing/dviajes-plan-bad-bunny-02-paquete', 'D’Viajes: Plan Bad Bunny, paquete'],
      ['cafe-marketing/dviajes-rutas-puerto-ordaz', 'D’Viajes: rutas desde Puerto Ordaz'],
      ['cafe-marketing/cafemkt-promo-01-llenalo-y-crece', 'Café Marketing: Llénalo y crece'],
      ['cafe-marketing/cafemkt-promo-02-te-ofrecemos', 'Café Marketing: Te ofrecemos'],
      ['cafe-marketing/cafemkt-promo-03-videos-y-fotos', 'Café Marketing: Videos y fotos'],
      ['cafe-marketing/cafemkt-promo-04-agenda-tu-cita', 'Café Marketing: Agenda tu cita'],
    ],
  }),
  project({
    slug: 'ovejero-uniformes',
    title: 'Ovejero Uniformes',
    year: '2019',
    category: 'Branding',
    tagline: 'Un rebranding que sigue vigente hoy.',
    client: 'Ovejero Uniformes',
    role: 'Rebranding (pasantía universitaria)',
    intro: 'Mi pasantía universitaria en Ovejero Uniformes, entre 2018 y 2019, fue un rebranding completo.',
    premise: {
      title: 'Una identidad que sigue en uso',
      paragraphs: [
        'Diseñé el logotipo con ícono de oveja, sus versiones de color y la papelería. La identidad sigue siendo la imagen oficial de la empresa hoy.',
      ],
    },
    process: [
      { title: 'Logotipo', text: 'Logotipo con ícono de oveja.' },
      { title: 'Versiones de color', text: 'Variantes para distintos fondos y usos.' },
      { title: 'Papelería', text: 'Aplicación de la identidad en papelería.' },
    ],
    cover: 'branding/ovejero-uniformes',
    gallery: [['branding/ovejero-uniformes', 'Lámina de rebranding de Ovejero Uniformes']],
  }),
  project({
    slug: 'mercado-libre-tucarro',
    title: 'Mercado Libre y TuCarro',
    year: '2022',
    category: 'Redes sociales',
    tagline: 'Campañas y tutoriales para dos marcas grandes.',
    client: 'Mercado Libre VE (vía agencia) y TuCarro.com',
    role: 'Diseñador gráfico',
    intro:
      'En 2022 diseñé piezas para Mercado Libre Venezuela, a través de una agencia, y para TuCarro.com, directamente, durante 6 meses.',
    premise: {
      title: 'Marcas grandes, mensajes claros',
      paragraphs: [
        'Para Mercado Libre diseñé piezas de prevención de estafas y de tiendas oficiales (LG). Para TuCarro, campañas, tutoriales e historias.',
      ],
    },
    process: [
      { title: 'Mercado Libre VE', text: 'Prevención de estafas y tiendas oficiales.' },
      { title: 'TuCarro', text: 'Campañas, tutoriales e historias durante 6 meses.' },
    ],
    cover: 'mercadolibre-tucarro/tucarro-promo',
    hero: ['mercadolibre-tucarro/tucarro-tutorial-moto', 'TuCarro: tutorial de moto'],
    gallery: [
      ['mercadolibre-tucarro/mercadolibre-prevencion-estafas', 'Mercado Libre: prevención de estafas'],
      ['mercadolibre-tucarro/mercadolibre-tienda-oficial-lg', 'Mercado Libre: tienda oficial LG'],
      ['mercadolibre-tucarro/tucarro-tutorial-moto', 'TuCarro: tutorial de moto'],
      ['mercadolibre-tucarro/tucarro-promo', 'TuCarro: promoción'],
    ],
  }),
  project({
    slug: 'portadas-musicales',
    title: 'Portadas musicales',
    year: '2022',
    category: 'Ilustración',
    tagline: 'Portadas para artistas independientes.',
    client: 'Artistas independientes',
    role: 'Diseño de portadas e ilustración',
    intro: 'Portadas para artistas: Landeau, Daerel (Big City y Honey), RK Wavy ft. Iverson, M4CO y Waze (Daydream).',
    premise: {
      title: 'Una imagen para cada canción',
      paragraphs: ['Cada portada se trabajó según el carácter del artista y de la canción.'],
    },
    process: [],
    cover: 'portadas-musicales/daerel-big-city',
    hero: ['portadas-musicales/daerel-big-city', 'Portada de Daerel: Big City'],
    gallery: [
      ['portadas-musicales/landeau-todo-va-a-estar-bien', 'Portada de Landeau: Todo va a estar bien'],
      ['portadas-musicales/daerel-big-city', 'Portada de Daerel: Big City'],
      ['flyers/photo_2022-04-27_12-27-05', 'Portada de Daerel: Honey'],
      ['portadas-musicales/rkwavy-los-negritos', 'Portada de RK Wavy: Los negritos'],
      ['portadas-musicales/m4co-necesito-tiempo', 'Portada de M4CO: Necesito tiempo'],
      ['flyers/photo_2022-04-27_12-27-19', 'Portada de Waze: Daydream'],
    ],
  }),
  project({
    slug: 'branding-de-marcas',
    title: 'Branding de marcas',
    year: '2022',
    category: 'Branding',
    tagline: 'Identidades para negocios y marcas nuevas.',
    client: 'Kryss Cakes, TAI Studio, Four-Two, Santuario y Chaporro',
    role: 'Identidad visual',
    intro: 'Identidades para Kryss Cakes, TAI Studio, Four-Two Streetwear, Santuario Streetwear y Chaporro.',
    premise: {
      title: 'Cada marca, a su manera',
      paragraphs: ['Cada identidad se definió según la naturaleza del negocio y de su público.'],
    },
    process: [],
    cover: 'branding/kryss-cakes',
    hero: ['flyers/photo_2021-08-09_19-49-03', 'Logotipo de Santuario Streetwear 2021'],
    gallery: [
      ['branding/kryss-cakes', 'Branding de Kryss Cakes'],
      ['branding/tai-studio', 'Branding de TAI Studio'],
      ['branding/four-two-streetwear', 'Branding de Four-Two Streetwear'],
      ['flyers/photo_2021-08-09_19-49-03', 'Logotipo de Santuario Streetwear 2021 sobre patrón de marca'],
      ['flyers/photo_2021-08-09_19-49-11', 'Sudadera con el logotipo de Santuario Streetwear'],
      ['flyers/photo_2022-04-27_11-48-17', 'Logotipo de Chaporro'],
    ],
  }),
  project({
    slug: 'flyers-de-eventos',
    title: 'Flyers de eventos',
    year: '2022',
    category: 'Flyers',
    tagline: 'Flyers y contenido para eventos de la escena local.',
    client: 'Rimastería, Last Food of the Year, Xperimental Battles, Bazar de emprendimientos y Daydream',
    role: 'Diseño de flyers y contenido para redes',
    intro:
      'Flyers y contenido para redes de eventos locales: la serie de la Jornada 1 de Rimastería, el Bazar de emprendimientos en Lechería, Last Food of the Year, Xperimental Battles y el lineup de Daydream.',
    premise: {
      title: 'Información clara, con actitud',
      paragraphs: [
        'Cada flyer prioriza lo que la gente necesita saber (fecha, lugar y quién participa) y lo dice con el tono de su evento.',
        'Para Rimastería diseñé una serie completa para la Jornada 1 (13/AGO, Plaza El Parque, Lechería): flyer, historias verticales, contenido de «loading» con DJ, jueces y host, y la pieza de agradecimiento con los logos de los aliados.',
      ],
    },
    process: [
      { title: 'Rimastería · Jornada 1', text: 'Serie de flyer cuadrado, historias verticales, contenido de «loading» y pieza de agradecimiento.' },
      { title: 'Bazar de emprendimientos', text: 'Flyer de stands para emprendimientos, 22/OCT en Plaza El Parque, Lechería.' },
      { title: 'Last Food of the Year', text: 'Flyer del «último delivery del año»: viernes 27/12 en Lido Kite Club, con lineup, DJ sets y los logos de Lacosta y Lido Kite.' },
      { title: 'Xperimental Battles', text: 'Flyer de batalla con premios, jurados, host e inscripción.' },
      { title: 'Daydream', text: 'Flyer de lineup sobre la ilustración de portada.' },
    ],
    cover: 'flyers/bazar-emprendimientos',
    hero: ['flyers/rimasteria_content', 'Rimastería: contenido «loading» de la Jornada 1'],
    gallery: [],
    groups: [
      {
        title: 'RIMASTERÍA · JORNADA 1',
        items: [
          ['flyers/rimasteriajornada1', 'Rimastería: flyer de la Jornada 1'],
          ['flyers/rimasteria_content', 'Rimastería: contenido «loading» de la Jornada 1'],
          ['flyers/rimasteriajornada1historia3', 'Rimastería: historia de la Jornada 1'],
          ['flyers/rimasteriajornada2historia', 'Rimastería: historia, versión de color'],
          ['flyers/rimasteria_content-agradecimiento', 'Rimastería: agradecimiento con los logos de los aliados'],
        ],
      },
      {
        title: 'BAZAR DE EMPRENDIMIENTOS',
        items: [['flyers/bazar-emprendimientos', 'Flyer del bazar de emprendimientos, Lechería']],
      },
      {
        title: 'LAST FOOD OF THE YEAR',
        items: [['flyers/flyer-last-food-lacosta', 'Flyer de Last Food of the Year, con Lacosta y Lido Kite']],
      },
      {
        title: 'XPERIMENTAL BATTLES',
        items: [['flyers/xperimental-battles', 'Flyer de Xperimental Battles']],
      },
      {
        title: 'DAYDREAM',
        items: [['flyers/photo_2022-04-27_12-28-24', 'Flyer del lineup de Daydream']],
      },
    ],
  }),
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
