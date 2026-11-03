import { clientLogo, type ClientLogo } from './logos';

export type Expertise = { label: string; title: string; text: string; logos: ClientLogo[] };

export const expertise: Expertise[] = [
  {
    label: 'BRANDING',
    title: 'Identidad, lettering y rebranding',
    text: 'Sistemas visuales con carácter para NTAC y ZIPO, y el rebranding de Ovejero Uniformes, aún en uso.',
    logos: [clientLogo('zipo', 'ZIPO')],
  },
  {
    label: 'DIRECCIÓN CREATIVA',
    title: 'Concepto y dirección de arte',
    text: 'Defino la idea central y dirijo la ejecución visual, como en La Festa Fest.',
    logos: [clientLogo('ntac', 'NTAC')],
  },
  {
    label: 'UX/UI',
    title: 'Interfaces que llevo a código',
    text: 'Flujos, arquitectura de información y pantallas que implemento yo mismo en Angular.',
    logos: [clientLogo('vexbiz', 'VEXBIZ')],
  },
  {
    label: 'REDES Y CONTENIDO',
    title: 'Campañas, catálogos y redes',
    text: 'Campañas, catálogos técnicos y contenido para marcas de tecnología y turismo.',
    logos: [clientLogo('mercado-libre', 'Mercado Libre'), clientLogo('tucarro', 'TuCarro')],
  },
];

export type Stat = { value: number; suffix?: string; label: string };

export const stats: Stat[] = [
  { value: 10, label: 'años diseñando' },
  { value: 12, label: 'marcas atendidas' },
  { value: 5, suffix: '\u00a0h', label: 'semanales ahorradas con automatización' },
];
