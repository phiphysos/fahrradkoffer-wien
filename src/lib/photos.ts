import type { ImageMetadata } from 'astro';

/**
 * Produktfotos werden automatisch aus src/assets/photos/ geladen.
 * Dateiname (ohne Endung) = Bildposition, z. B. hero.jpg oder produkt.webp.
 * Fehlt ein Foto, zeigt die Seite stattdessen eine schematische Zeichnung.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export type PhotoSlot = 'hero' | 'produkt' | 'abholung';

export function getPhoto(slot: PhotoSlot): ImageMetadata | undefined {
  for (const [path, mod] of Object.entries(files)) {
    const name = path.split('/').pop()?.replace(/\.[^.]+$/, '').toLowerCase();
    if (name === slot) return mod.default;
  }
  return undefined;
}
