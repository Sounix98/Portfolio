import { site } from './site';

export type Social = { id: string; label: string; display: string; href: string; external: boolean };

// TODO: añadir LinkedIn y Behance cuando existan, e Instagram (@waze86) si Sounix confirma que va.
export const socials: Social[] = [
  { id: 'email', label: 'EMAIL', display: site.email, href: `mailto:${site.email}`, external: false },
  { id: 'whatsapp', label: 'WHATSAPP', display: site.phone, href: site.whatsapp, external: true },
];

export const footerSocials = socials.filter((s) => s.external);
