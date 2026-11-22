/**
 * ─────────────────────────────────────────────────────────────
 *  Zentrale Konfiguration – alle Inhalte, die du anpassen musst.
 * ─────────────────────────────────────────────────────────────
 *
 *  Nach jeder Änderung: speichern, committen, pushen.
 *  GitHub Actions baut und veröffentlicht die Seite automatisch neu.
 */

export const contact = {
  /**
   * Empfänger für Anfragen (Formular, Footer, Kontaktlinks).
   * ⚠️ Unbedingt durch deine echte Adresse ersetzen!
   */
  email: 'florian.altmann@hotmail.com',
};

export const business = {
  name: 'Fahrradkoffer mieten Wien',
  shortName: 'Fahrradkoffer Wien',
  /** Wird in der Browser-Registerkarte und in Suchergebnissen angezeigt. */
  title: 'Fahrradkoffer mieten in Wien – B&W Bike Bag 2.0 | Westbahnhof',
  description:
    'Fahrradkoffer mieten in Wien: B&W Bike Bag 2.0 für Rennrad, Gravel, Triathlon und MTB. Ab 10 € pro Tag, 60 € pro Woche. Persönliche Abholung beim Westbahnhof.',
};

export const location = {
  name: 'Wien Westbahnhof',
  postalCode: '1150',
  city: 'Wien',
  country: 'Österreich',
  /** Öffentliche Anbindung – nur Fakten, die für den Bahnhof selbst gelten. */
  transit: 'U3 und U6 halten direkt am Westbahnhof.',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wien+Westbahnhof%2C+1150+Wien',
};

export const pricing = {
  /** Preis pro Koffer und Tag in Euro */
  day: 10,
  /** Preis pro Koffer und Woche in Euro */
  week: 60,
  /** Rückerstattbare Kaution pro Koffer in Euro */
  deposit: 100,
};

export const product = {
  name: 'B&W Bike Bag 2.0',
  /** Anzahl der Koffer, die du vermietest (steuert auch das Formular). */
  units: 2,
  weightKg: 8.6,
  condition: 'Sehr guter Zustand',
  /** Außenmaße in Millimetern */
  outer: { length: 1360, width: 854, depth: 297 },
  /** Innenmaße in Millimetern */
  inner: { length: 1350, width: 810, depth: 280 },
  bikeTypes: ['Rennrad', 'Gravelbike', 'Triathlonrad', 'Mountainbike bis 29″'],
  /**
   * Optional: Link zum Pack-Video (z. B. YouTube).
   * Leer lassen, dann wird nur erwähnt, dass es ein Video gibt.
   */
  packingVideoUrl: '',
};

/**
 * Pflichtangaben für Impressum & Datenschutz.
 * In Österreich braucht praktisch jede Website eine Offenlegung
 * (§ 25 MedienG, ggf. § 5 ECG). Bitte vollständig ausfüllen.
 */
export const legal = {
  ownerName: 'Florian Altmann',
  street: 'Dingelstedtgasse 6',
  postalCity: '1150 Wien',
};
