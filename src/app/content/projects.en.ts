/** English (US) copy for the projects, keyed by project slug. Image alts, group titles and link labels are in `phrasesEn`. */
export type ProjectText = {
  title: string;
  category: string;
  tagline: string; // keep it at most ~55 characters like the Spanish one
  label?: string; // only for projects that have a `label` in Spanish
  client: string;
  role: string;
  intro: string;
  premise: { title: string; paragraphs: string[] }; // same number of paragraphs as the Spanish
  process: { title: string; text: string }[]; // same number and order of steps as the Spanish ([] if Spanish is [])
  facts?: { label: string; value: string }[]; // only for projects with a custom fact sheet in Spanish
  tools?: string;
};

export const projectsEn: Record<string, ProjectText> = {
  'vexbiz-marketplace': {
    title: 'VEXBIZ Marketplace',
    category: 'UX/UI and Frontend',
    tagline: 'A clearer B2B marketplace, built in code.',
    client: 'VEXBIZ',
    role: 'UX/UI, art direction and frontend',
    tools: 'Figma, Photoshop (layout), Angular',
    intro:
      'VEXBIZ is a B2B marketplace that brings together verified stores for refrigeration, automotive, hardware, pharmacies, industrial supplies, solar panels and more, with payment protected until delivery.',
    premise: {
      title: 'Making the buying and selling flow clear',
      paragraphs: [
        'The buying and selling flow was unclear, and the app felt unfriendly to the businesses using it.',
        'The solution is a clearer, more approachable interface with category navigation, verified stores and a simplified checkout.',
      ],
    },
    process: [
      { title: 'Flow review', text: 'I reviewed the buying and selling flow to bring clarity and better usability.' },
      { title: 'Architecture with IT', text: 'Together with the IT department, I defined the categories, the main views and the checkout features.' },
      { title: 'Design to code', text: 'I took the design straight to code in Angular, with AI assistance.' },
    ],
  },
  ntac: {
    title: 'NTAC',
    category: 'Creative Direction',
    tagline: 'My streetwear brand: identity, merch and online store.',
    label: 'Own brand',
    client: 'NTAC (own brand)',
    role: 'Creative direction, identity, illustration, UX and frontend',
    tools: 'Photoshop, Illustrator, Figma',
    intro:
      'NTAC (Never Trust A Cop) is my streetwear and graffiti brand from Puerto Ordaz: oversized 220 gsm cotton garments customized with stencils, textile ink and hand curing.',
    premise: {
      title: 'A brand with its own attitude, online too',
      paragraphs: [
        'I wanted to create a brand with its own attitude and an online experience consistent with it: a website that feels like the streets the clothes come from.',
        'The result is a complete visual system: an oval lettering logo, the character from the “Le monde est à vous” illustration, a 2026/2027 collection with original illustrations (“La prisa nos esclaviza” (“Hurry enslaves us”), “El dolor no se fue” (“The pain didn’t go away”), “Crecer” (“Grow”)), art direction for the lookbook, and an online store with its own look and feel.',
        'The brand has been active since 2021, and its 2026/2027 collection is available for pre-order. The store is a clickable prototype: prices, stock and shipping are placeholder data.',
      ],
    },
    process: [
      { title: 'Identity', text: 'An oval lettering logo, a character and the “Le monde est à vous” illustration, designed for stamps, labels and garments.' },
      { title: 'Collection and lookbook', text: 'Illustrations for each garment, product photography and urban portraits with a color direction of their own: acid green on black and teal.' },
      { title: 'Web: visual language', text: 'A dark background, acid green as the only accent, and condensed uppercase headlines, with outlined text, caution tape and photos with torn-paper edges.' },
      { title: 'Web: flow', text: 'A message ticker and a hero with the slogan; the collection drop in a panel gallery; available products; a manifesto; pillars; and a “Comenta NTAC” (“Comment NTAC”) closing section that leads to Instagram.' },
    ],
  },
  ledco: {
    title: 'LEDCO',
    category: 'Editorial and Social Media',
    tagline: 'Technical catalog and campaign for LED screens.',
    client: 'LEDCO (Puerto Rico)',
    role: 'Graphic designer, remote',
    tools: 'Photoshop',
    intro:
      'LEDCO (formerly LED Factory) is a Puerto Rico company that sells indoor and outdoor LED screens and outdoor TVs. Its tagline: “Create your Vision.”',
    premise: {
      title: 'A technical product line, clearly explained',
      paragraphs: [
        'A broad technical line of 13 models had to be presented clearly and attractively, in English, for the US and Puerto Rican markets.',
        'I designed the product catalog (1920×1080, in English): cover, “Why LEDCO,” stock, and one sheet per model with an application photo and a specifications table, plus technical pages on assembly, maintenance and curved designs.',
        'I also designed the social media campaign for the PoolPRO QLED Full Outdoor TV, the Instagram identity, horizontal banners and pieces from the LED Factory era.',
      ],
    },
    process: [
      { title: 'Product catalog', text: 'One sheet per model with an application photo and a specifications table.' },
      { title: 'PoolPRO QLED campaign', text: 'Launch, benefits, comparison with a traditional TV, sizes, and a CTA to request the catalog by DM.' },
      { title: 'Instagram identity', text: 'Highlight icons, a logo post and stories.' },
    ],
  },
  'la-festa-fest': {
    title: 'La Festa Fest',
    category: 'Creative Direction',
    tagline: 'A festival that does not exist, with a real identity.',
    label: 'Concept project',
    client: 'Concept project',
    role: 'Creative direction, identity, illustration and characters',
    tools: 'Photoshop, Illustrator',
    intro:
      'La Festa Fest doesn’t exist: it’s a fictional music festival I created as a creative direction exercise, designing it as if it were real.',
    premise: {
      title: 'The complete identity of an event',
      paragraphs: [
        'The challenge was to build the complete identity of an event with a personality of its own.',
        'I designed a bubble-lettering logo, an illustrated key visual with a stage and ants carrying the structure, and three characters presented as polaroids: FeStar (host), Skitt (graffiti writer) and Beatzzy (promoter). Hashtag: #ViveLaFesta.',
      ],
    },
    process: [
      { title: 'Logo', text: 'Bubble lettering with the event date.' },
      { title: 'Key visual', text: 'An illustrated stage with ants carrying the structure.' },
      { title: 'Characters', text: 'FeStar, Skitt and Beatzzy, presented as polaroids.' },
    ],
    facts: [
      { label: 'Client', value: 'Concept project' },
      { label: 'Scope', value: 'Creative direction, logo, key visual and characters' },
      { label: 'Process', value: 'Bubble lettering → illustration → characters' },
      { label: 'Year', value: '2025' },
    ],
  },
  zipo: {
    title: 'ZIPO',
    category: 'Branding and Merch',
    tagline: 'A hand-drawn rebrand: fire lettering for his merch.',
    label: 'Returning client',
    client: 'ZIPO',
    role: 'Rebrand, logo and merch application',
    tools: 'Photoshop, Illustrator',
    intro:
      'ZIPO moves between music, business and event production. He needed an image that would work the same on a T-shirt, a flyer or a stage, and that felt like his own, not off the shelf.',
    premise: {
      title: 'A gesture that doesn’t come from a template',
      paragraphs: [
        'I started on paper. I drew the logo by hand to keep the stroke and energy of the name, then took the flames into Photoshop and Illustrator to vectorize them without losing that character. The result is a commercial brand ready to produce merch, with a gesture that doesn’t come from a template.',
        'It’s an ongoing working relationship: ZIPO comes back whenever his brand needs a new piece.',
      ],
    },
    process: [
      { title: 'Hand illustration', text: 'I drew the logo on paper to keep the stroke and energy of the name.' },
      { title: 'Vectorizing', text: 'I took the flames into Photoshop and Illustrator to vectorize them without losing their character, in black and white versions.' },
      { title: 'Merch', text: 'T-shirts and embroidered caps following the brand’s graphic line.' },
      { title: '2024 poster', text: 'An editorial piece that brings the lettering to a large format.' },
    ],
    facts: [
      { label: 'Client', value: 'ZIPO, musician and event promoter' },
      { label: 'Scope', value: 'Rebrand, logo, merch application' },
      { label: 'Process', value: 'Hand illustration → vectorization' },
      { label: 'Relationship', value: 'Returning client since 2024' },
    ],
  },
  'cafe-marketing': {
    title: 'Café Marketing Campaigns',
    category: 'Social Media',
    tagline: 'Carousels that sell: tech, travel and more.',
    client: 'Café Marketing',
    role: 'Designer and community manager',
    tools: 'Photoshop',
    intro:
      'During 2025 I was a designer and community manager at Café Marketing, an agency, handling 5 local client accounts.',
    premise: {
      title: 'Content for very different accounts',
      paragraphs: [
        'Each account spoke to a different audience (technology, travel and the agency itself), so the design and tone changed from one to the next.',
        'Nanologic: a Father’s Day carousel, free delivery, and a tech support piece with humor. D’Viajes: the Bad Bunny Medellín 2026 plan and flight routes from Puerto Ordaz. Café Marketing: plans and services (“No lo dejes medio vacío… Llénalo y crece” (“Don’t leave it half empty… Fill it up and grow”)).',
      ],
    },
    process: [
      { title: 'Nanologic', text: 'A Father’s Day carousel, free delivery and tech support.' },
      { title: 'D’Viajes', text: 'The Bad Bunny Medellín 2026 plan and flight routes from Puerto Ordaz.' },
      { title: 'Café Marketing', text: 'A campaign for the agency’s own plans and services.' },
    ],
    facts: [
      { label: 'Client', value: 'Café Marketing and its accounts: Nanologic, D’Viajes' },
      { label: 'Scope', value: 'Content design, carousels, campaigns and community management' },
      { label: 'Accounts', value: '5 local client accounts' },
      { label: 'Year', value: '2025' },
    ],
  },
  'ovejero-uniformes': {
    title: 'Ovejero Uniformes',
    category: 'Branding',
    tagline: 'A rebrand the company still uses today.',
    client: 'Ovejero Uniformes',
    role: 'Rebranding (university internship)',
    tools: 'Photoshop, Illustrator',
    intro:
      'Ovejero Uniformes used the word “Ovejero” set in Jokerman as its logo. During my university internship, between 2018 and 2019, I rebuilt its entire image.',
    premise: {
      title: 'An identity that is still in use',
      paragraphs: [
        'I designed the logo with a sheep icon, its color versions for different backgrounds and the stationery, and adapted the design for embroidery.',
        'Today that identity runs through its entire image: staff uniforms, machine labeling, social media and a new relief sign in the store window.',
      ],
    },
    process: [
      { title: 'Starting point', text: 'Its logo was the word “Ovejero” set in Jokerman.' },
      { title: 'Logo', text: 'A logo with a sheep icon.' },
      { title: 'Color versions', text: 'Variants for different backgrounds and uses.' },
      { title: 'Stationery', text: 'The identity applied to stationery.' },
      { title: 'Embroidery', text: 'Design adapted for embroidery.' },
    ],
    facts: [
      { label: 'Client', value: 'Ovejero Uniformes' },
      { label: 'Scope', value: 'Rebrand: logo, color versions, stationery and embroidery-ready design' },
      { label: 'Relationship', value: 'University internship, 2018–2019' },
      { label: 'Status', value: 'Staff uniforms, machine labeling, social media and the store’s relief sign' },
    ],
  },
  'mercado-libre-tucarro': {
    title: 'Mercado Libre and TuCarro',
    category: 'Social Media',
    tagline: 'Campaigns and tutorials for two major brands.',
    client: 'Mercado Libre VE (via agency) and TuCarro.com',
    role: 'Graphic designer',
    tools: 'Photoshop',
    intro:
      'In 2022 I worked for two major brands: Mercado Libre Venezuela, through an agency, and TuCarro.com, directly, for 6 months.',
    premise: {
      title: 'Major brands, clear messages',
      paragraphs: [
        'For Mercado Libre I designed very targeted campaigns: scam prevention, where the message has to land at a glance, and promotions like Black Friday and discounts.',
        'For LG’s official store I designed the pieces for its products that Mercado Libre promoted on Instagram. For TuCarro, over 6 months: campaigns, tutorials and stories.',
      ],
    },
    process: [
      { title: 'Mercado Libre VE', text: 'Scam prevention, promotions and discounts, and LG product pieces for Instagram.' },
      { title: 'TuCarro', text: 'Campaigns, tutorials and stories over 6 months.' },
    ],
    facts: [
      { label: 'Client', value: 'Mercado Libre Venezuela (via agency) and TuCarro.com' },
      { label: 'Scope', value: 'Scam prevention, promotions, LG product pieces, and campaigns, tutorials and stories' },
      { label: 'Relationship', value: 'Agency (Mercado Libre) · direct, 6 months (TuCarro)' },
      { label: 'Year', value: '2022' },
    ],
  },
  'portadas-musicales': {
    title: 'Music Covers',
    category: 'Illustration',
    tagline: 'Cover art for independent artists.',
    client: 'Independent artists',
    role: 'Cover design and illustration',
    tools: 'Photoshop',
    intro:
      'A cover is the first thing people see of a song. These are for independent artists: Landeau, Daerel (Big City and Honey), RK Wavy ft. Iverson, M4CO and Waze (Daydream).',
    premise: {
      title: 'An image for every song',
      paragraphs: [
        'Each cover was developed around the character of the artist and the song, without repeating a formula.',
        'If the artist comes with something clear, I translate it to paper just as I picture and hear it. If I have freedom, I connect with the situation the song describes. I always make three sketches and start from the one the artist picks.',
      ],
    },
    process: [
      { title: 'Listen and visualize', text: 'I translate to paper what the artist has in mind, or what the song’s situation conveys to me.' },
      { title: 'Three sketches', text: 'I present three proposals to the artist.' },
      { title: 'The chosen one', text: 'I develop the cover from the sketch they pick.' },
    ],
    facts: [
      { label: 'Client', value: 'Independent artists' },
      { label: 'Scope', value: 'Cover design and illustration' },
      { label: 'Process', value: 'Three sketches → the artist chooses → cover' },
      { label: 'Artists', value: 'Landeau, Daerel, RK Wavy ft. Iverson, M4CO, Waze' },
      { label: 'Year', value: '2022' },
    ],
  },
  'branding-de-marcas': {
    title: 'Brand Identities',
    category: 'Branding',
    tagline: 'Identities for businesses and new brands.',
    client: 'Kryss Cakes, TAI Studio, Four-Two, Santuario and Chaporro',
    role: 'Visual identity',
    tools: 'Photoshop, Illustrator',
    intro:
      'Five brands, five different businesses: Kryss Cakes, TAI Studio, Four-Two Streetwear, Santuario Streetwear (a streetwear brand from Maracay) and Chaporro (a VFX editor). For each one I built an identity tailored to it.',
    premise: {
      title: 'Each brand, in its own way',
      paragraphs: [
        'Each identity was defined around the nature of the business and its audience: a cake shop, a studio, a VFX editor and streetwear brands can’t all speak the same way.',
      ],
    },
    process: [],
    facts: [
      { label: 'Client', value: 'Kryss Cakes, TAI Studio, Four-Two, Santuario and Chaporro' },
      { label: 'Scope', value: 'Visual identity' },
      { label: 'Year', value: '2022' },
    ],
  },
  'flyers-de-eventos': {
    title: 'Event Flyers',
    category: 'Flyers',
    tagline: 'Flyers and content for local scene events.',
    client: 'Rimastería, Last Food of the Year, Xperimental Battles, Bazar de emprendimientos and Daydream',
    role: 'Flyer design and social media content',
    tools: 'Photoshop',
    intro:
      'Flyers and social media content for local events: the Rimastería Round 1 series, the Bazar de emprendimientos (small business market) in Lechería, Last Food of the Year, Xperimental Battles and the Daydream lineup.',
    premise: {
      title: 'Clear information, with attitude',
      paragraphs: [
        'Each flyer prioritizes what people need to know (date, place and who is taking part) and says it in the tone of its event.',
        'For Rimastería I designed a complete series for Round 1 (AUG 13, Plaza El Parque, Lechería): a flyer, vertical stories, “loading” content with the DJ, judges and host, and the thank-you piece with the partners’ logos.',
      ],
    },
    process: [
      { title: 'Rimastería · Round 1', text: 'A series with a square flyer, vertical stories, “loading” content and a thank-you piece.' },
      { title: 'Bazar de emprendimientos', text: 'A stand flyer for small businesses, OCT 22 at Plaza El Parque, Lechería.' },
      { title: 'Last Food of the Year', text: 'A flyer for the “last delivery of the year”: Friday 12/27 at Lido Kite Club, with lineup, DJ sets and the Lacosta and Lido Kite logos.' },
      { title: 'Xperimental Battles', text: 'A battle flyer with prizes, judges, host and registration.' },
      { title: 'Daydream', text: 'A lineup flyer over the cover illustration.' },
    ],
  },
};

/** Spanish string -> English string, for image alt texts, gallery group titles and link labels. The key must be the EXACT Spanish string used in projects.ts. */
export const phrasesEn: Record<string, string> = {
  // Link labels
  Sitio: 'Site',

  // Group titles
  'App móvil': 'Mobile app',
  'Marca y contexto': 'Brand and context',
  'LA WEB · FLUJO Y LOOK & FEEL': 'THE WEBSITE · FLOW AND LOOK & FEEL',
  IDENTIDAD: 'IDENTITY',
  'COLECCIÓN 2026/2027': '2026/2027 COLLECTION',
  CRECER: 'CRECER (GROW)',
  'DISEÑOS ESPECIALES': 'SPECIAL DESIGNS',
  'TALLER Y STENCIL': 'WORKSHOP AND STENCIL',
  'RIMASTERÍA · JORNADA 1': 'RIMASTERÍA · ROUND 1',
  'BAZAR DE EMPRENDIMIENTOS': 'BAZAR DE EMPRENDIMIENTOS (SMALL BUSINESS MARKET)',

  // VEXBIZ
  'VEXBIZ: wordmark sobre fondo de red': 'VEXBIZ: wordmark on a network background',
  'Marketplace VEXBIZ en móvil: inicio, categorías y página de nicho de Refrigeración':
    'VEXBIZ marketplace on mobile: home, categories and the Refrigeration niche page',
  'Marketplace VEXBIZ en móvil: producto, carrito y entrega y pago':
    'VEXBIZ marketplace on mobile: product, cart, and delivery and payment',
  'Marketplace VEXBIZ en móvil: inicio de sesión, cuenta y nicho Automotriz en tema claro':
    'VEXBIZ marketplace on mobile: sign-in, account and Automotive niche in light theme',
  'Marketplace VEXBIZ en móvil: inicio y producto en tema claro y oscuro':
    'VEXBIZ marketplace on mobile: home and product in light and dark themes',
  'Furgoneta de VEXBIZ Suministros recorriendo una avenida al atardecer': 'VEXBIZ Suministros van driving down an avenue at sunset',
  'Wordmark de VEXBIZ en relieve sobre fondo claro': 'Embossed VEXBIZ wordmark on a light background',
  'Wordmark de VEXBIZ sobre fondo azul oscuro con red de puntos': 'VEXBIZ wordmark on a dark blue background with a dot network',
  'Furgoneta de VEXBIZ en una calle con palmeras': 'VEXBIZ van on a palm-lined street',

  // NTAC
  'Lookbook NTAC: calle de noche': 'NTAC lookbook: street at night',
  'Web de NTAC: hero «Never Trust A Cop» con cinta de mensajes': 'NTAC website: “Never Trust A Cop” hero with message ticker',
  'Web de NTAC: cintas de precaución y encabezado del drop «Cada pieza, un megáfono»':
    'NTAC website: caution tape and the drop header “Cada pieza, un megáfono” (“Every piece, a megaphone”)',
  'Web de NTAC: galería de paneles del drop y sección «Disponible ahora»':
    'NTAC website: drop panel gallery and the “Disponible ahora” (“Available now”) section',
  'Web de NTAC: tarjetas de producto con precio, descripción y variantes': 'NTAC website: product cards with price, description and variants',
  'Web de NTAC: manifiesto con tipografía gigante y fotos con borde rasgado':
    'NTAC website: manifesto with giant type and torn-edge photos',
  'Web de NTAC: pilares sobre fondo verde ácido': 'NTAC website: pillars on an acid green background',
  'Web de NTAC: cierre «Comenta NTAC» con fotos dispersas': 'NTAC website: “Comenta NTAC” closing section with scattered photos',
  'Lámina de branding de NTAC: logotipo, personaje y camisetas': 'NTAC branding board: logo, character and T-shirts',
  'Logotipo de NTAC en verde': 'NTAC logo in green',
  'Lookbook NTAC: camiseta «Le monde est à vous» en un skatepark': 'NTAC lookbook: “Le monde est à vous” T-shirt at a skatepark',
  'Lookbook NTAC: pasillo de supermercado': 'NTAC lookbook: supermarket aisle',
  'Lookbook NTAC: logotipo gigante sobre un edificio': 'NTAC lookbook: giant logo on a building',
  'Lookbook NTAC: camiseta con óvalo NTAC en una escalera': 'NTAC lookbook: T-shirt with the NTAC oval on a staircase',
  'Lookbook NTAC: dos modelos en una estación de servicio': 'NTAC lookbook: two models at a gas station',
  'Colección 2026/2027: «La prisa nos esclaviza» en camiseta negra': '2026/2027 collection: “La prisa nos esclaviza” on a black T-shirt',
  'Colección 2026/2027: espalda de «La prisa nos esclaviza»': '2026/2027 collection: back of “La prisa nos esclaviza”',
  'Colección 2026/2027: «La prisa nos esclaviza», camiseta blanca': '2026/2027 collection: “La prisa nos esclaviza” on a white T-shirt',
  'Colección 2026/2027: «La prisa nos esclaviza», espalda en camiseta crema':
    '2026/2027 collection: “La prisa nos esclaviza”, back on a cream T-shirt',
  'Colección 2026/2027: frente de la camiseta crema': '2026/2027 collection: front of the cream T-shirt',
  'Colección 2026/2027: «El dolor no se fue»': '2026/2027 collection: “El dolor no se fue”',
  'Colección 2026/2027: ilustración «Naturaleza»': '2026/2027 collection: “Naturaleza” illustration',
  'Colección 2026/2027: «Naturaleza», retrato': '2026/2027 collection: “Naturaleza”, portrait',
  'Colección 2026/2027: «Naturaleza», espalda': '2026/2027 collection: “Naturaleza”, back',
  'Diseño «Crecer»: camiseta blanca en percha': '“Crecer” design: white T-shirt on a hanger',
  'Diseño «Crecer»: espalda en un ascensor': '“Crecer” design: back view in an elevator',
  'Diseño «Crecer»: camiseta en alto': '“Crecer” design: T-shirt held up',
  'Diseño «Your Friendly Neighbour»: espalda': '“Your Friendly Neighbour” design: back',
  'Diseño «Your Friendly Neighbour» en percha': '“Your Friendly Neighbour” design on a hanger',
  'Diseño «Great Power»': '“Great Power” design',
  'Prendas NTAC estampadas sobre el suelo del taller': 'Printed NTAC garments on the workshop floor',
  'Detalle de estampado en tinta textil': 'Detail of a textile ink print',
  'Detalle del estampado «Le monde est à vous» sobre tela': 'Detail of the “Le monde est à vous” print on fabric',

  // LEDCO
  'Catálogo de LEDCO: pantalla LiteXT para interiores': 'LEDCO catalog: LiteXT indoor screen',
  'Post de LEDCO: Create your Vision, PoolPRO QLED': 'LEDCO post: Create your Vision, PoolPRO QLED',
  'Portada del catálogo de productos de LEDCO': 'Cover of the LEDCO product catalog',
  'Página del catálogo de LEDCO': 'LEDCO catalog page',
  'Ficha de modelo del catálogo de LEDCO': 'LEDCO catalog model sheet',
  'Página técnica del catálogo de LEDCO': 'LEDCO catalog technical page',
  'PoolPRO QLED: carrusel de lanzamiento': 'PoolPRO QLED: launch carousel',
  'PoolPRO QLED: características': 'PoolPRO QLED: features',
  'PoolPRO QLED: tabla de tamaños': 'PoolPRO QLED: size chart',
  'Íconos de highlights de Instagram de LEDCO': 'LEDCO Instagram highlight icons',
  'Banner horizontal PoolPRO QLED': 'PoolPRO QLED horizontal banner',
  'Flyer para Home Power Sun Energy, cliente de LEDCO': 'Flyer for Home Power Sun Energy, a LEDCO client',

  // La Festa Fest
  'Key visual de La Festa Fest 2025': 'La Festa Fest 2025 key visual',
  'Logotipo de La Festa Fest': 'La Festa Fest logo',
  'Personaje FeStar, host del evento': 'FeStar character, the event host',
  'Personaje Skitt, graffiti writer': 'Skitt character, graffiti writer',
  'Personaje Beatzzy, promotor': 'Beatzzy character, promoter',

  // ZIPO
  'Diseño de merch de ZIPO': 'ZIPO merch design',
  'Póster ZIPO 2024': 'ZIPO 2024 poster',
  'Línea gráfica de merch de ZIPO': 'ZIPO merch graphic line',
  'Logotipo de ZIPO en negro': 'ZIPO logo in black',

  // Café Marketing
  'D’Viajes: Plan Bad Bunny, portada': 'D’Viajes: Bad Bunny Plan, cover',
  'Nanologic: portada del carrusel Día del Padre': 'Nanologic: Father’s Day carousel cover',
  'Nanologic: laptops, Día del Padre': 'Nanologic: laptops, Father’s Day',
  'Nanologic: combos, Día del Padre': 'Nanologic: bundles, Father’s Day',
  'Nanologic: all in one, Día del Padre': 'Nanologic: all-in-one PCs, Father’s Day',
  'Nanologic: delivery gratis': 'Nanologic: free delivery',
  'Nanologic: servicio técnico': 'Nanologic: tech support',
  'D’Viajes: Plan Bad Bunny, paquete': 'D’Viajes: Bad Bunny Plan, package',
  'D’Viajes: rutas desde Puerto Ordaz': 'D’Viajes: routes from Puerto Ordaz',
  'Café Marketing: Llénalo y crece': 'Café Marketing: Llénalo y crece (Fill it up and grow)',
  'Café Marketing: Te ofrecemos': 'Café Marketing: Te ofrecemos (We offer you)',
  'Café Marketing: Videos y fotos': 'Café Marketing: Videos and photos',
  'Café Marketing: Agenda tu cita': 'Café Marketing: Book your appointment',

  // Ovejero
  'Lámina de rebranding de Ovejero Uniformes': 'Ovejero Uniformes rebranding board',
  'Ovejero Uniformes: logotipo y paleta de color': 'Ovejero Uniformes: logo and color palette',
  'Ovejero Uniformes: versiones color, azul marino e invertida': 'Ovejero Uniformes: color, navy and reversed versions',
  'Ovejero Uniformes: isotipo en sus tres versiones': 'Ovejero Uniformes: emblem in its three versions',
  'Ovejero Uniformes: uso del logo sobre distintos fondos': 'Ovejero Uniformes: the logo on different backgrounds',

  // Mercado Libre / TuCarro
  'TuCarro: tutorial de moto': 'TuCarro: motorcycle tutorial',
  'Mercado Libre: prevención de estafas': 'Mercado Libre: scam prevention',
  'Mercado Libre: tienda oficial LG': 'Mercado Libre: LG official store',
  'TuCarro: promoción': 'TuCarro: promotion',

  // Music covers
  'Portada de Daerel: Big City': 'Cover for Daerel: Big City',
  'Portada de Landeau: Todo va a estar bien': 'Cover for Landeau: Todo va a estar bien',
  'Portada de Daerel: Honey': 'Cover for Daerel: Honey',
  'Portada de RK Wavy: Los negritos': 'Cover for RK Wavy: Los negritos',
  'Portada de M4CO: Necesito tiempo': 'Cover for M4CO: Necesito tiempo',
  'Portada de Waze: Daydream': 'Cover for Waze: Daydream',

  // Brand identities
  'Logotipo de Santuario Streetwear 2021': 'Santuario Streetwear 2021 logo',
  'Branding de Kryss Cakes': 'Kryss Cakes branding',
  'Branding de TAI Studio': 'TAI Studio branding',
  'Branding de Four-Two Streetwear': 'Four-Two Streetwear branding',
  'Ovejero Uniformes: tarjetas personales en azul marino con el patrón de la oveja': 'Ovejero Uniformes: navy business cards with the sheep pattern',
  'Ovejero Uniformes: papelería con la identidad': 'Ovejero Uniformes: stationery with the identity',
  'Logotipo de Kryss Cakes': 'Kryss Cakes logo',
  'Logotipo de Mercado Libre': 'Mercado Libre logo',
  'Logotipo de TAI Studio': 'TAI Studio logo',
  'Logotipo de Four-Two Streetwear': 'Four-Two Streetwear logo',
  'Kryss Cakes: tarjetas personales sobre fondo rosa y durazno': 'Kryss Cakes: business cards on a pink and peach background',
  'Kryss Cakes: tarjeta con el patrón de brocado': 'Kryss Cakes: card with the brocade pattern',
  'Kryss Cakes: reverso de la tarjeta con los datos de contacto': 'Kryss Cakes: card back with contact details',
  'TAI Studio: publicación con el kanji de la marca': 'TAI Studio: post with the brand’s kanji',
  'TAI Studio: afiche «We are style» 2020': 'TAI Studio: “We are style” poster, 2020',
  'TAI Studio: cuadrícula del perfil de Instagram': 'TAI Studio: Instagram profile grid',
  'TAI Studio: composición editorial en rojo y negro': 'TAI Studio: editorial composition in red and black',
  'TAI Studio: kanji sobre negro': 'TAI Studio: kanji on black',
  'Four-Two Streetwear: historia de Instagram, métodos de pago': 'Four-Two Streetwear: Instagram story, payment methods',
  'Four-Two Streetwear: historia de Instagram, delivery': 'Four-Two Streetwear: Instagram story, delivery',
  'Four-Two Streetwear: historia de Instagram, clientes': 'Four-Two Streetwear: Instagram story, customers',
  'Kryss Cakes': 'Kryss Cakes',
  'TAI Studio': 'TAI Studio',
  'Four-Two Streetwear': 'Four-Two Streetwear',
  'Santuario y Chaporro': 'Santuario and Chaporro',
  'Kryss Cakes: logotipo y paleta de color': 'Kryss Cakes: logo and color palette',
  'Kryss Cakes: logo completo, ilustración y logotipo por separado': 'Kryss Cakes: full logo, illustration and wordmark on their own',
  'TAI Studio: logotipo y colores': 'TAI Studio: logo and colors',
  'TAI Studio: logotipo sobre claro, rojo y negro': 'TAI Studio: logo on light, red and black',
  'TAI Studio: el kanji de la marca sobre negro y sobre claro': 'TAI Studio: the brand’s kanji on black and on light',
  'Four-Two Streetwear: logotipo': 'Four-Two Streetwear: logo',
  'Four-Two Streetwear: logotipo y numeral, en claro y en oscuro': 'Four-Two Streetwear: logo and numeral, light and dark',
  'Logotipo de Santuario Streetwear 2021 sobre patrón de marca': 'Santuario Streetwear 2021 logo on a brand pattern',
  'Sudadera con el logotipo de Santuario Streetwear': 'Sweatshirt with the Santuario Streetwear logo',
  'Logotipo de Chaporro': 'Chaporro logo',

  // Event flyers
  'Rimastería: contenido «loading» de la Jornada 1': 'Rimastería: “loading” content for Round 1',
  'Rimastería: flyer de la Jornada 1': 'Rimastería: Round 1 flyer',
  'Rimastería: historia de la Jornada 1': 'Rimastería: Round 1 story',
  'Rimastería: historia, versión de color': 'Rimastería: story, color version',
  'Rimastería: agradecimiento con los logos de los aliados': 'Rimastería: thank-you piece with the partners’ logos',
  'Flyer del bazar de emprendimientos, Lechería': 'Flyer for the small business market, Lechería',
  'Flyer de Last Food of the Year, con Lacosta y Lido Kite': 'Last Food of the Year flyer, with Lacosta and Lido Kite',
  'Flyer de Xperimental Battles': 'Xperimental Battles flyer',
  'Flyer del lineup de Daydream': 'Daydream lineup flyer',
};
