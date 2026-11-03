/** Logos vectoriales (blancos, fondo transparente) en public/images/logos. Tamaño = viewBox del SVG. */
const SIZES: Record<string, readonly [number, number]> = {
  'avatar-ilustracion.mono': [168, 150],
  'cafe-marketing': [360, 459],
  capibara: [338, 97],
  'conejo-mascara': [114, 201],
  dviajes: [546, 99],
  'four-two': [213, 95],
  'kryss-cakes': [195, 195],
  lacosta: [383, 69],
  lecheria: [309, 108],
  ledco: [703, 304],
  'mercado-libre': [397, 102],
  nanologic: [161, 180],
  ntac: [955, 506],
  ovejero: [455, 363],
  pesher: [296, 144],
  'tai-studio': [189, 126],
  tucarro: [409, 87],
  vexbiz: [1127, 439],
  w: [185, 147],
  zipo: [881, 700],
};

export type EventLogo = {
  name: string;
  src: string;
  w: number;
  h: number;
  /** mono: blanco sobre transparente · color: logo a color (se muestra en escala de grises). */
  mode: 'mono' | 'color';
};

const logo = (key: string, name: string, mode: EventLogo['mode'] = 'mono'): EventLogo => {
  const [w, h] = SIZES[key] ?? [300, 100];
  return { name, src: `/images/logos/${key}.svg`, w, h, mode };
};

/**
 * Logos de aliados que aparecen en los flyers de Rimastería (extraídos de
 * assets/flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg con fondo transparente).
 */
export const eventLogos: EventLogo[] = [
  logo('lecheria', 'Lechería'),
  logo('lacosta', 'Lacosta'),
  logo('avatar-ilustracion.mono', 'Aliado ilustrado'),
  logo('conejo-mascara', 'Logo de conejo con máscara'),
  logo('w', 'Logo W'),
  logo('capibara', 'Capibara Food Delivery'),
  logo('pesher', 'Pesher Barber Shop'),
];

export type ClientLogo = {
  name: string;
  src: string;
  w: number;
  h: number;
  /** Alto de visualización en px: normaliza el peso visual entre logos anchos y cuadrados. */
  dh: number;
};

/** `key` = nombre del SVG en public/images/logos (logo blanco con fondo transparente). */
export const clientLogo = (key: string, name: string): ClientLogo => {
  const [w, h] = SIZES[key] ?? [200, 80];
  const dh = Math.min(36, Math.max(22, 150 / (w / h)));
  return { name, src: `/images/logos/${key}.svg`, w, h, dh };
};

// Clientes y marcas destacadas del carrusel de Sobre mí.
export const clientLogos: ClientLogo[] = [
  clientLogo('ledco', 'LEDCO'),
  clientLogo('mercado-libre', 'Mercado Libre'),
  clientLogo('zipo', 'ZIPO'),
  clientLogo('tucarro', 'TuCarro'),
  clientLogo('ntac', 'NTAC'),
  clientLogo('nanologic', 'Nanologic'),
  clientLogo('dviajes', 'D’Viajes'),
  clientLogo('cafe-marketing', 'Café Marketing'),
  clientLogo('ovejero', 'Ovejero Uniformes'),
  clientLogo('tai-studio', 'Tai Studio'),
  clientLogo('four-two', 'Four-Two Streetwear'),
  clientLogo('kryss-cakes', 'Kryss Cakes'),
];
