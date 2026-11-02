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
    title: 'VEXBIZ — Diseñador, Director de Arte y Marketing',
    text: 'Rediseño del flujo de compra y venta; categorías, vistas y checkout con IT; frontend en Angular con IA; automatización con IA que ahorra hasta 5 h semanales sin ampliar la nómina.',
    mark: 'VX',
  },
  {
    period: '2023 — 2026',
    title: 'Freelance y agencias — Diseñador Gráfico',
    text: 'Café Marketing (2025, diseñador y community manager); ZIPO (cliente recurrente desde 2024); encargos para pequeños negocios.',
    mark: 'F',
  },
  {
    period: '2022',
    title: 'Mercado Libre Latam y TuCarro.com — Diseñador Gráfico',
    text: 'Mercado Libre VE vía agencia: prevención de estafas y tiendas oficiales (LG). TuCarro directo, 6 meses: campañas, tutoriales e historias.',
    mark: 'ML',
  },
  {
    period: '2019 — 2023',
    title: 'LEDCO, antes LED Factory — Diseñador Gráfico',
    location: 'Remoto · Puerto Rico',
    text: 'Catálogo de productos en inglés; campaña en redes del PoolPRO QLED; identidad en Instagram; contenido para pantallas LED.',
    mark: 'LE',
  },
  {
    period: '2018 — 2019',
    title: 'Ovejero Uniformes — Diseñador (pasantía)',
    text: 'Rebranding vigente hoy; diseño para bordado.',
    mark: 'OV',
  },
  {
    period: '2016 — 2018',
    title: 'Corporación FBK / Tiendas Kioto — Diseñador Junior',
    text: 'Fotografía de producto, maquetación y prototipado web.',
    mark: 'FK',
  },
];
