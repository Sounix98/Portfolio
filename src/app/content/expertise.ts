import { clientLogo, type ClientLogo } from './logos';

export type Expertise = { label: string; title: string; text: string; logos: ClientLogo[] };

export const expertise: Expertise[] = [
  {
    label: 'BRANDING',
    title: 'Identidad, lettering y rebranding',
    text: 'Logotipos y sistemas visuales con carácter: de NTAC y ZIPO a un rebranding que sigue vigente.',
    logos: [clientLogo('zipo', 'ZIPO')],
  },
  {
    label: 'DIRECCIÓN CREATIVA',
    title: 'Conceptos, personajes e ilustración',
    text: 'La idea central y la dirección de arte de proyectos como La Festa Fest.',
    logos: [clientLogo('ntac', 'NTAC')],
  },
  {
    label: 'UX/UI',
    title: 'Interfaces que llevo a código',
    text: 'Flujos, arquitectura de información y diseño de pantallas, con frontend en Angular.',
    logos: [clientLogo('vexbiz', 'VEXBIZ')],
  },
  {
    label: 'REDES Y CONTENIDO',
    title: 'Campañas, catálogos y piezas para redes',
    text: 'Carruseles, catálogos técnicos y contenido para marcas de tecnología, turismo y más.',
    logos: [clientLogo('mercado-libre', 'Mercado Libre'), clientLogo('tucarro', 'TuCarro')],
  },
];

export type Stat = { value: number; suffix?: string; label: string };

export const stats: Stat[] = [
  { value: 10, label: 'AÑOS DE EXPERIENCIA' },
  { value: 39, label: 'PÁGINAS DE CATÁLOGO PARA LEDCO' },
  { value: 5, label: 'CUENTAS GESTIONADAS EN 2025' },
];
