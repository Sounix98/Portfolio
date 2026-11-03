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
  /** Si existe, sustituye a las filas por defecto (cliente, año, rol, tipo) de la ficha del caso. */
  facts?: { label: string; value: string }[];
  /** Herramientas del proyecto (se añade como última fila de la ficha). */
  tools?: string;
  links?: { label: string; url: string }[];
  cover: Pic;
  /** Si existe, el fondo del hero rota entre estas imágenes (la primera es la portada). */
  heroSlides?: Pic[];
  /** Si existe, el hero muestra estos logos en blanco, sin fondo, sobre el negro de la página (a modo de introducción). */
  heroLogos?: Pic[];
  /** Imagen de fondo del hero con logos: se muestra desenfocada, bajo un panel de cristal. */
  heroBackdrop?: Pic;
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

type Seed = Omit<Project, 'cover' | 'thumb' | 'gallery' | 'galleryGroups' | 'heroSlides' | 'heroLogos' | 'heroBackdrop'> & {
  cover: string;
  /** [clave, alt] de imágenes extra para el carrusel del hero (tras la portada). */
  slides?: [string, string][];
  /** [clave, alt] de logos blancos con transparencia para la introducción del hero. */
  logos?: [string, string][];
  /** [clave, alt] de la imagen que se desenfoca detrás de los logos. */
  backdrop?: [string, string];
  /** [clave, alt] de la miniatura; si falta, se usa la portada. */
  hero?: [string, string];
  gallery: [string, string][]; // [clave, alt]
  groups?: { title: string; items: [string, string][] }[];
};

const project = ({ cover, hero, slides, logos, backdrop, gallery, groups, ...seed }: Seed): Project => {
  const galleryGroups = groups?.map((g) => ({ title: g.title, images: g.items.map(([k, alt]) => pic(k, alt)) }));
  return {
    ...seed,
    cover: pic(cover, seed.title),
    heroLogos: logos?.map(([k, alt]) => pic(k, alt)),
    heroBackdrop: backdrop ? pic(backdrop[0], backdrop[1]) : undefined,
    heroSlides: slides ? [pic(cover, seed.title), ...slides.map(([k, alt]) => pic(k, alt))] : undefined,
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
    tools: 'Figma, Photoshop (maquetación), Angular',
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
    tools: 'Photoshop, Illustrator, Figma',
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
    tools: 'Photoshop',
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
    cover: 'ledco/banners/ledco-banner-01-sin-logo',
    slides: [
      ['ledco/catalogo/catalogo-12', 'Catálogo de LEDCO: pantalla LiteXT para interiores'],
      ['ledco/redes/poolpro-qled-03-create-your-vision-16x9', 'Post de LEDCO: Create your Vision, PoolPRO QLED'],
    ],
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
    tools: 'Photoshop, Illustrator',
    intro:
      'La Festa Fest no existe: es un festival musical ficticio que creé como ejercicio de dirección creativa, diseñándolo como si fuera real.',
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
    facts: [
      { label: 'Cliente', value: 'Proyecto conceptual' },
      { label: 'Alcance', value: 'Dirección creativa, logotipo, key visual y personajes' },
      { label: 'Proceso', value: 'Lettering bubble → ilustración → personajes' },
      { label: 'Año', value: '2025' },
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
    tagline: 'Rebranding a mano: lettering de fuego para su merch.',
    label: 'Cliente recurrente',
    client: 'ZIPO',
    role: 'Rebranding, logotipo y aplicación a merch',
    tools: 'Photoshop, Illustrator',
    intro:
      'ZIPO se mueve entre la música, los negocios y la producción de eventos. Necesitaba una imagen que funcionara igual en una franela, un flyer o una tarima, y que se sintiera suya, no de catálogo.',
    premise: {
      title: 'Un gesto que no sale de una plantilla',
      paragraphs: [
        'Empecé en papel. Dibujé el logo a mano para conservar el trazo y la energía del nombre, y después llevé las flamas a Photoshop e Illustrator para vectorizarlas sin perder ese carácter. El resultado es una marca comercial lista para producir merch, con un gesto que no sale de una plantilla.',
        'Es una relación de trabajo que continúa: ZIPO vuelve cada vez que su marca necesita una pieza nueva.',
      ],
    },
    process: [
      { title: 'Ilustración a mano', text: 'Dibujé el logo en papel para conservar el trazo y la energía del nombre.' },
      { title: 'Vectorización', text: 'Llevé las flamas a Photoshop e Illustrator para vectorizarlas sin perder su carácter, en versión negra y blanca.' },
      { title: 'Merch', text: 'Camisetas y gorras bordadas con la línea gráfica de la marca.' },
      { title: 'Póster 2024', text: 'Una pieza editorial que lleva el lettering a gran formato.' },
    ],
    facts: [
      { label: 'Cliente', value: 'ZIPO, músico y promotor de eventos' },
      { label: 'Alcance', value: 'Rebranding, logotipo, aplicación a merch' },
      { label: 'Proceso', value: 'Ilustración a mano → vectorización' },
      { label: 'Relación', value: 'Cliente recurrente desde 2024' },
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
    tools: 'Photoshop',
    intro:
      'Durante 2025 fui diseñador y community manager en Café Marketing, una agencia, con 5 cuentas de clientes locales.',
    premise: {
      title: 'Contenido para cuentas muy distintas',
      paragraphs: [
        'Cada cuenta le hablaba a un público distinto (tecnología, turismo y la propia agencia), así que el diseño y el tono cambiaban de una a otra.',
        'Nanologic: carrusel de Día del Padre, delivery gratis y servicio técnico con humor. D’Viajes: Plan Bad Bunny Medellín 2026 y rutas aéreas desde Puerto Ordaz. Café Marketing: planes y servicios («No lo dejes medio vacío… Llénalo y crece»).',
      ],
    },
    process: [
      { title: 'Nanologic', text: 'Carrusel Día del Padre, delivery gratis y servicio técnico.' },
      { title: 'D’Viajes', text: 'Plan Bad Bunny Medellín 2026 y rutas aéreas desde Puerto Ordaz.' },
      { title: 'Café Marketing', text: 'Campaña de planes y servicios de la propia agencia.' },
    ],
    facts: [
      { label: 'Cliente', value: 'Café Marketing y sus cuentas: Nanologic, D’Viajes' },
      { label: 'Alcance', value: 'Diseño de contenido, carruseles, campañas y community management' },
      { label: 'Cuentas', value: '5 cuentas de clientes locales' },
      { label: 'Año', value: '2025' },
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
    tagline: 'Un rebranding que la marca sigue usando hoy.',
    client: 'Ovejero Uniformes',
    role: 'Rebranding (pasantía universitaria)',
    tools: 'Photoshop, Illustrator',
    intro:
      'Ovejero Uniformes usaba como logo la palabra «Ovejero» escrita en Jokerman. En mi pasantía universitaria, entre 2018 y 2019, me tocó rehacer toda su imagen.',
    premise: {
      title: 'Una identidad que sigue en uso',
      paragraphs: [
        'Diseñé el logotipo con un ícono de oveja, sus versiones de color para distintos fondos y la papelería, y adapté el diseño para bordado.',
        'Hoy esa identidad está en toda su imagen: los uniformes del personal, el rotulado de máquinas, las redes sociales y un letrero nuevo en relieve en la vidriera de la tienda.',
      ],
    },
    process: [
      { title: 'Punto de partida', text: 'Su logo era la palabra «Ovejero» escrita en Jokerman.' },
      { title: 'Logotipo', text: 'Logotipo con ícono de oveja.' },
      { title: 'Versiones de color', text: 'Variantes para distintos fondos y usos.' },
      { title: 'Papelería', text: 'Aplicación de la identidad en papelería.' },
      { title: 'Bordado', text: 'Diseño adaptado para bordado.' },
    ],
    facts: [
      { label: 'Cliente', value: 'Ovejero Uniformes' },
      { label: 'Alcance', value: 'Rebranding: logotipo, versiones de color, papelería y diseño para bordado' },
      { label: 'Relación', value: 'Pasantía universitaria, 2018–2019' },
      { label: 'Vigencia', value: 'Uniformes, rotulado de máquinas, redes sociales y letrero en relieve de la tienda' },
    ],
    cover: 'branding/ovejero-laminas/ovejero-portada',
    logos: [['branding/hero/ovejero-logo-blanco', 'Logotipo de Ovejero Uniformes']],
    gallery: [
      ['branding/ovejero-laminas/ovejero-lamina-01-logotipo', 'Ovejero Uniformes: logotipo y paleta de color'],
      ['branding/ovejero-mocks/ovejero-tarjetas-oscuras', 'Ovejero Uniformes: tarjetas personales en azul marino con el patrón de la oveja'],
      ['branding/ovejero-laminas/ovejero-lamina-02-versiones', 'Ovejero Uniformes: versiones color, azul marino e invertida'],
      ['branding/ovejero-mocks/ovejero-papeleria', 'Ovejero Uniformes: papelería con la identidad'],
      ['branding/ovejero-laminas/ovejero-lamina-03-isotipo', 'Ovejero Uniformes: isotipo en sus tres versiones'],
      ['branding/ovejero-laminas/ovejero-lamina-04-fondos', 'Ovejero Uniformes: uso del logo sobre distintos fondos'],
    ],
  }),
  project({
    slug: 'mercado-libre-tucarro',
    title: 'Mercado Libre y TuCarro',
    year: '2022',
    category: 'Redes sociales',
    tagline: 'Campañas y tutoriales para dos marcas grandes.',
    client: 'Mercado Libre VE (vía agencia) y TuCarro.com',
    role: 'Diseñador gráfico',
    tools: 'Photoshop',
    intro:
      'En 2022 trabajé para dos marcas grandes: Mercado Libre Venezuela, a través de una agencia, y TuCarro.com, directamente, durante 6 meses.',
    premise: {
      title: 'Marcas grandes, mensajes claros',
      paragraphs: [
        'Para Mercado Libre diseñé campañas muy puntuales: prevención de estafas, donde el mensaje tiene que entenderse de un vistazo, y promociones como Black Friday y descuentos.',
        'Para la tienda oficial de LG diseñé las piezas de sus productos que Mercado Libre promocionaba en Instagram. Para TuCarro, durante 6 meses: campañas, tutoriales e historias.',
      ],
    },
    process: [
      { title: 'Mercado Libre VE', text: 'Prevención de estafas, promociones y descuentos, y piezas de producto de LG para Instagram.' },
      { title: 'TuCarro', text: 'Campañas, tutoriales e historias durante 6 meses.' },
    ],
    facts: [
      { label: 'Cliente', value: 'Mercado Libre Venezuela (vía agencia) y TuCarro.com' },
      { label: 'Alcance', value: 'Prevención de estafas, promociones, piezas de producto LG, y campañas, tutoriales e historias' },
      { label: 'Relación', value: 'Agencia (Mercado Libre) · directo, 6 meses (TuCarro)' },
      { label: 'Año', value: '2022' },
    ],
    cover: 'mercadolibre-tucarro/ml-portada',
    logos: [['branding/hero/mercado-libre-logo-blanco', 'Logotipo de Mercado Libre']],
    backdrop: ['mercadolibre-tucarro/mercadolibre-prevencion-estafas', 'Mercado Libre: prevención de estafas'],
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
    tools: 'Photoshop',
    intro:
      'Una portada es lo primero que se ve de una canción. Estas son las de artistas independientes: Landeau, Daerel (Big City y Honey), RK Wavy ft. Iverson, M4CO y Waze (Daydream).',
    premise: {
      title: 'Una imagen para cada canción',
      paragraphs: [
        'Cada portada se trabajó según el carácter del artista y de la canción, sin repetir una fórmula.',
        'Si el artista llega con algo claro, lo traduzco al papel tal como lo visualizo y lo escucho. Si tengo libertad, me conecto con la situación que plantea la canción. Siempre hago tres bocetos y parto del que escoge el artista.',
      ],
    },
    process: [
      { title: 'Escuchar y visualizar', text: 'Traduzco al papel lo que el artista tiene claro, o lo que me transmite la situación de la canción.' },
      { title: 'Tres bocetos', text: 'Presento tres propuestas al artista.' },
      { title: 'La elegida', text: 'Desarrollo la portada a partir del boceto que él escoge.' },
    ],
    facts: [
      { label: 'Cliente', value: 'Artistas independientes' },
      { label: 'Alcance', value: 'Diseño de portadas e ilustración' },
      { label: 'Proceso', value: 'Tres bocetos → el artista elige → portada' },
      { label: 'Artistas', value: 'Landeau, Daerel, RK Wavy ft. Iverson, M4CO, Waze' },
      { label: 'Año', value: '2022' },
    ],
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
    tools: 'Photoshop, Illustrator',
    intro:
      'Cinco marcas, cinco negocios distintos: Kryss Cakes, TAI Studio, Four-Two Streetwear, Santuario Streetwear (una marca de streetwear de Maracay) y Chaporro (un editor de VFX). Para cada una construí una identidad a su medida.',
    premise: {
      title: 'Cada marca, a su manera',
      paragraphs: [
        'Cada identidad se definió según la naturaleza del negocio y de su público: una repostería, un estudio, un editor de VFX y marcas de streetwear no pueden hablar igual.',
      ],
    },
    process: [],
    facts: [
      { label: 'Cliente', value: 'Kryss Cakes, TAI Studio, Four-Two, Santuario y Chaporro' },
      { label: 'Alcance', value: 'Identidad visual' },
      { label: 'Año', value: '2022' },
    ],
    cover: 'branding/kryss-cakes-laminas/kryss-cakes-portada',
    logos: [
      ['branding/hero/kryss-cakes-logo-blanco', 'Logotipo de Kryss Cakes'],
      ['branding/hero/tai-studio-logo-blanco', 'Logotipo de TAI Studio'],
      ['branding/hero/four-two-logo-blanco', 'Logotipo de Four-Two Streetwear'],
    ],
    hero: ['flyers/photo_2021-08-09_19-49-03', 'Logotipo de Santuario Streetwear 2021'],
    gallery: [],
    groups: [
      {
        title: 'Kryss Cakes',
        items: [
          ['branding/kryss-cakes-laminas/kryss-cakes-separador', 'Logotipo de Kryss Cakes'],
          ['branding/kryss-cakes-laminas/kryss-cakes-lamina-01-logotipo', 'Kryss Cakes: logotipo y paleta de color'],
          ['branding/kryss-cakes-mocks/kryss-tarjetas-sobre-fondo', 'Kryss Cakes: tarjetas personales sobre fondo rosa y durazno'],
          ['branding/kryss-cakes-mocks/kryss-tarjeta-patron', 'Kryss Cakes: tarjeta con el patrón de brocado'],
          ['branding/kryss-cakes-mocks/kryss-tarjeta-datos', 'Kryss Cakes: reverso de la tarjeta con los datos de contacto'],
          ['branding/kryss-cakes-laminas/kryss-cakes-lamina-02-componentes', 'Kryss Cakes: logo completo, ilustración y logotipo por separado'],
        ],
      },
      {
        title: 'TAI Studio',
        items: [
          ['branding/tai-studio-laminas/tai-studio-separador', 'Logotipo de TAI Studio'],
          ['branding/tai-studio-laminas/tai-studio-lamina-01-logotipo', 'TAI Studio: logotipo y colores'],
          ['branding/tai-studio-mocks/tai-post-kanji', 'TAI Studio: publicación con el kanji de la marca'],
          ['branding/tai-studio-mocks/tai-afiche-2020', 'TAI Studio: afiche «We are style» 2020'],
          ['branding/tai-studio-mocks/tai-cuadricula-instagram', 'TAI Studio: cuadrícula del perfil de Instagram'],
          ['branding/tai-studio-mocks/tai-diseno-editorial', 'TAI Studio: composición editorial en rojo y negro'],
          ['branding/tai-studio-mocks/tai-kanji-negro', 'TAI Studio: kanji sobre negro'],
          ['branding/tai-studio-laminas/tai-studio-lamina-02-versiones', 'TAI Studio: logotipo sobre claro, rojo y negro'],
          ['branding/tai-studio-laminas/tai-studio-lamina-03-kanji', 'TAI Studio: el kanji de la marca sobre negro y sobre claro'],
        ],
      },
      {
        title: 'Four-Two Streetwear',
        items: [
          ['branding/four-two-laminas/four-two-separador', 'Logotipo de Four-Two Streetwear'],
          ['branding/four-two-laminas/four-two-lamina-01-logotipo', 'Four-Two Streetwear: logotipo'],
          ['branding/four-two-mocks/four-two-historia-metodos-de-pago', 'Four-Two Streetwear: historia de Instagram, métodos de pago'],
          ['branding/four-two-mocks/four-two-historia-delivery', 'Four-Two Streetwear: historia de Instagram, delivery'],
          ['branding/four-two-mocks/four-two-historia-clientes', 'Four-Two Streetwear: historia de Instagram, clientes'],
          ['branding/four-two-laminas/four-two-lamina-02-versiones', 'Four-Two Streetwear: logotipo y numeral, en claro y en oscuro'],
        ],
      },
      {
        title: 'Santuario y Chaporro',
        items: [
          ['flyers/photo_2021-08-09_19-49-03', 'Logotipo de Santuario Streetwear 2021 sobre patrón de marca'],
          ['flyers/photo_2021-08-09_19-49-11', 'Sudadera con el logotipo de Santuario Streetwear'],
          ['flyers/photo_2022-04-27_11-48-17', 'Logotipo de Chaporro'],
        ],
      },
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
    tools: 'Photoshop',
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
