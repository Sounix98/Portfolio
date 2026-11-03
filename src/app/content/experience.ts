export type Experience = {
  period: string;
  title: string;
  location?: string;
  text: string;
  /** Monograma de 1–2 letras; sustituir por un SVG de logo cuando exista. */
  mark: string;
};

export const experience: Experience[] = [
  {
    period: 'JUN 2026 — ACTUALIDAD',
    title: 'VEXBIZ — Diseño y dirección de arte',
    text: 'Rediseñé con IT el flujo de compra y venta (categorías, vistas y checkout) y lo implemento en Angular. Automaticé procesos con IA: hasta 5 h semanales ahorradas sin sumar personal.',
    mark: 'VX',
  },
  {
    period: '2023 — 2026',
    title: 'Freelance y agencias — Diseñador Gráfico',
    text: 'Diseño y community management para Café Marketing (2025). ZIPO, cliente recurrente desde 2024. Identidad y piezas para pequeños negocios.',
    mark: 'F',
  },
  {
    period: '2022',
    title: 'Mercado Libre Latam y TuCarro.com — Diseñador Gráfico',
    text: 'Campañas de prevención de estafas y tiendas oficiales (LG) para Mercado Libre Venezuela, vía agencia. Seis meses directo con TuCarro: campañas, tutoriales e historias.',
    mark: 'ML',
  },
  {
    period: '2019 — 2023',
    title: 'LEDCO, antes LED Factory — Diseñador Gráfico',
    location: 'Remoto · Puerto Rico',
    text: 'Cuatro años en remoto para Puerto Rico: catálogo de producto en inglés (23 páginas), campaña del PoolPRO QLED, identidad en Instagram y contenido para pantallas LED.',
    mark: 'LE',
  },
  {
    period: '2018 — 2019',
    title: 'Ovejero Uniformes — Diseñador (pasantía)',
    text: 'Rebranding que la marca sigue usando hoy y diseño adaptado a bordado.',
    mark: 'OV',
  },
  {
    period: '2016 — 2018',
    title: 'Corporación FBK / Tiendas Kioto — Diseñador Junior',
    text: 'Fotografía de producto, maquetación y prototipado web.',
    mark: 'FK',
  },
];
