import { media } from './media';

export type EventLogo = {
  name: string;
  src: string;
  w: number;
  h: number;
  /** mono: blanco sobre transparente · color: logo a color (se muestra en escala de grises). */
  mode: 'mono' | 'color';
};

const logo = (key: string, name: string, mode: EventLogo['mode'] = 'mono'): EventLogo => {
  const m = media[`flyers/logos/${key}`];
  return { name, src: `/images/flyers/logos/${key}.webp`, w: m?.w ?? 300, h: m?.h ?? 100, mode };
};

/**
 * Logos de aliados que aparecen en los flyers de Rimastería (extraídos de
 * assets/flyers/RIMASTERIA_CONTENT AGRADECIMIENTO.jpg con fondo transparente).
 */
export const eventLogos: EventLogo[] = [
  logo('lecheria', 'Lechería'),
  logo('lacosta', 'Lacosta'),
  logo('avatar-ilustracion', 'Aliado ilustrado', 'color'),
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

/** `key` = nombre del archivo en assets/clientes (logo blanco con fondo transparente). */
export const clientLogo = (key: string, name: string): ClientLogo => {
  const m = media[`clientes/${key}`];
  const w = m?.w ?? 200;
  const h = m?.h ?? 80;
  const dh = Math.min(36, Math.max(22, 150 / (w / h)));
  return { name, src: `/images/clientes/${key}.webp`, w, h, dh };
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
];
