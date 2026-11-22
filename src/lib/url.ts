/** Baut eine Adresse relativ zum GitHub-Pages-Unterpfad, z. B. url('impressum/') → /fahrradkoffer-wien/impressum/ */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}

/** Absolute Adresse inkl. Domain, z. B. für Canonical, Open Graph und Sitemap. */
export function absoluteUrl(path = ''): string {
  return new URL(url(path), import.meta.env.SITE).href;
}

/** Formatiert Euro-Beträge im österreichischen Format, z. B. 8,57 €. */
export function euro(value: number, digits = 0): string {
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** 1360 → „1 360“ – Zahlenformat nach österreichischer Konvention (de-AT). */
export function num(value: number, digits = 0): string {
  return new Intl.NumberFormat('de-AT', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
