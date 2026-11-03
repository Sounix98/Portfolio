/** English (US) copy for the site-wide texts. Same shapes as the Spanish defaults. */
import type { Experience } from './experience';
import { clientLogo } from './logos';
import type { Expertise, Stat } from './expertise';
import type { SiteCopy, UiCopy } from './site';

export const siteEn: SiteCopy = {
  name: 'Sounix Romero',
  brand: 'SOUNIX',
  role: 'Graphic Designer & UX/UI',
  location: 'Puerto Ordaz',
  email: 'sounixromero@gmail.com',
  phone: '+58 414 881 2017',
  whatsapp: 'https://wa.me/584148812017',
  year: 2026,
  description:
    'I design brands and digital products. And I build them in code. Sounix Romero, designer and art director in Puerto Ordaz, Venezuela · remote work.',
  heroSubtitle:
    'I design brands with character and digital products that make sense. From visual identity to interface in code.',
  worksDescription:
    'Identities, campaigns, catalogs and interfaces. From my own brand to client projects in Venezuela, Puerto Rico and Latin America.',
  statement: 'I design brands and digital products. And I build them in code.',
  statementSubtitle: 'Sounix Romero — designer and art director. Puerto Ordaz, Venezuela · remote work.',
  statementParagraph:
    'For 10 years I’ve designed pieces that have to work in the real world: LED screens at massive events, scam-prevention campaigns for Mercado Libre, streetwear brands that live on the street. Today I bring that same rigor to product: at VEXBIZ I redesigned the buying and selling flow, and I’m building it in Angular.',
  contactIntro: 'Open to remote product roles and brand projects. Reach out however you prefer.',
};

export const uiEn: UiCopy = {
  nav: { works: 'WORK', about: 'ABOUT', contact: 'CONTACT', menu: 'MENU', close: 'CLOSE' },
  allWorks: 'ALL WORK',
  details: 'DETAILS',
  premise: 'THE CHALLENGE',
  process: 'PROCESS',
  client: 'CLIENT',
  year: 'YEAR',
  role: 'ROLE',
  type: 'TYPE',
  links: 'LINKS',
  nextProject: 'Next project',
  expertise: 'MY EXPERTISE',
  clients: 'SELECTED CLIENTS',
  experience: 'EXPERIENCE',
  contact: 'LET’S TALK',
  grid: 'Grid',
  full: 'Full',
  view: 'View',
  next: 'Next',
  basedIn: 'BASED IN',
  notFound: 'This page doesn’t exist.',
  backHome: 'BACK TO HOME',
  aria: {
    main: 'Main',
    mobileMenu: 'Mobile menu',
    homeSuffix: ' — home',
    projects: 'projects',
    gallery: 'Gallery',
    figures: 'Key figures',
    testimonials: 'Testimonials',
    clients: 'Clients',
    social: 'Social links',
    loading: 'Loading',
    language: 'Language',
    notFoundTitle: 'Not found',
  },
};

export const expertiseEn: Expertise[] = [
  {
    label: 'BRANDING',
    title: 'Identity, lettering and rebranding',
    text: 'Visual systems with character for NTAC and ZIPO, and the rebrand of Ovejero Uniformes, still in use.',
    logos: [clientLogo('zipo', 'ZIPO')],
  },
  {
    label: 'CREATIVE DIRECTION',
    title: 'Concept and art direction',
    text: 'I define the core idea and direct the visual execution, as on La Festa Fest.',
    logos: [clientLogo('ntac', 'NTAC')],
  },
  {
    label: 'UX/UI',
    title: 'Interfaces I take to code',
    text: 'Flows, information architecture and screens that I implement myself in Angular.',
    logos: [clientLogo('vexbiz', 'VEXBIZ')],
  },
  {
    label: 'SOCIAL & CONTENT',
    title: 'Campaigns, catalogs and social media',
    text: 'Campaigns, technical catalogs and content for tech and tourism brands.',
    logos: [clientLogo('mercado-libre', 'Mercado Libre'), clientLogo('tucarro', 'TuCarro')],
  },
];

export const statsEn: Stat[] = [
  { value: 10, label: 'years designing' },
  { value: 12, label: 'brands served' },
  { value: 5, suffix: ' h', label: 'saved weekly through automation' },
];

export const experienceEn: Experience[] = [
  {
    period: 'JUN 2026 — PRESENT',
    title: 'VEXBIZ — Design and art direction',
    text: 'With IT, I redesigned the buying and selling flow (categories, views and checkout) and I’m implementing it in Angular. I automated processes with AI: up to 5 hours saved per week without adding headcount.',
    mark: 'VX',
  },
  {
    period: '2023 — 2026',
    title: 'Freelance and agencies — Graphic Designer',
    text: 'Design and community management for Café Marketing (2025). ZIPO, a recurring client since 2024. Identity and pieces for small businesses.',
    mark: 'F',
  },
  {
    period: '2022',
    title: 'Mercado Libre Latam and TuCarro.com — Graphic Designer',
    text: 'Scam-prevention campaigns and official stores (LG) for Mercado Libre Venezuela, through an agency. Six months directly with TuCarro: campaigns, tutorials and stories.',
    mark: 'ML',
  },
  {
    period: '2019 — 2023',
    title: 'LEDCO, formerly LED Factory — Graphic Designer',
    location: 'Remote · Puerto Rico',
    text: 'Four years working remotely for Puerto Rico: English-language product catalog (23 pages), the PoolPRO QLED campaign, Instagram identity and content for LED screens.',
    mark: 'LE',
  },
  {
    period: '2018 — 2019',
    title: 'Ovejero Uniformes — Designer (internship)',
    text: 'A rebrand the company still uses today, plus designs adapted for embroidery.',
    mark: 'OV',
  },
  {
    period: '2016 — 2018',
    title: 'Corporación FBK / Tiendas Kioto — Junior Designer',
    text: 'Product photography, layout and web prototyping.',
    mark: 'FK',
  },
];
