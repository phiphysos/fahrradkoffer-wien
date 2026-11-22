# Fahrradkoffer mieten Wien

Statische One-Page-Website für den privaten Verleih von zwei **B&W Bike Bag 2.0** in Wien (Abholung beim Westbahnhof).
Gebaut mit [Astro](https://astro.build), ohne Backend, ohne Tracking, ohne Cookies – kostenlos hostbar auf GitHub Pages.

- Mobile-first, getestet bei 320, 375, 390, 768 und 1440 px Breite
- Anfrageformular erzeugt eine vorausgefüllte E-Mail (`mailto:`), inkl. Validierung
- Selbst gehostete Schriften (Archivo, Inter) – keine Anfragen an Google Fonts
- Icons von [Lucide](https://lucide.dev), beim Build als Inline-SVG eingebettet
- SEO: Meta-Tags, Open Graph, Canonical, `sitemap.xml`, `robots.txt`, JSON-LD (`Service` mit Preisen)
- Automatische Bildoptimierung (AVIF/WebP) für eigene Fotos

---

## 1. Lokal starten

Voraussetzung: [Node.js](https://nodejs.org) 20 oder neuer (empfohlen: 22).

```bash
npm install
npm run dev
```

Die Seite läuft dann unter <http://localhost:4321/fahrradkoffer-wien/>.

Produktions-Build testen:

```bash
npm run build
npm run preview
```

---

## 2. Was du anpassen musst

Fast alles steht in **einer Datei: [`site.config.ts`](site.config.ts)**.

| Wert                         | Wo                         | Pflicht? |
| ---------------------------- | -------------------------- | -------- |
| E-Mail-Adresse für Anfragen  | `contact.email`            | **Ja** – aktuell Platzhalter `kontakt@example.com` |
| Name + Anschrift (Impressum) | `legal.ownerName`, `legal.street`, `legal.postalCity` | **Ja** – in Österreich praktisch Pflicht (§ 25 MedienG, ggf. § 5 ECG) |
| Preise / Kaution             | `pricing.day`, `pricing.week`, `pricing.deposit` | nein (10 € / 60 € / 100 €) |
| Anzahl Koffer                | `product.units`            | nein (2) – steuert auch die Auswahl im Formular |
| Link zum Pack-Video          | `product.packingVideoUrl`  | optional – wird dann verlinkt |
| Seitentitel / Beschreibung   | `business.title`, `business.description` | optional |
| Produktfotos                 | `src/assets/photos/`       | empfohlen (siehe Abschnitt 4) |
| Social-Media-Vorschaubild    | `public/og-image.png`      | optional – wird durch `hero.jpg` automatisch ersetzt |

Solange E-Mail oder Impressum-Daten fehlen, gibt `npm run build` eine Warnung aus, und die Rechtsseiten zeigen gelb markierte Platzhalter.

> Die Texte für Impressum und Datenschutz sind eine sorgfältige Vorlage, passend zu dieser technischen Umsetzung – aber keine Rechtsberatung. Bitte prüfe sie für deinen Fall.

---

## 3. Preise und Kontakt ändern

1. `site.config.ts` öffnen.
2. Zum Beispiel `pricing.week: 60` auf `pricing.week: 55` ändern oder bei `contact.email` deine Adresse eintragen.
3. Speichern, committen, pushen:

   ```bash
   git add site.config.ts
   git commit -m "Preise aktualisiert"
   git push
   ```

GitHub Actions baut die Seite automatisch neu (dauert ca. 1–2 Minuten). Preise erscheinen überall gleichzeitig: Hero, Preiskarten, Sticky-Leiste, FAQ und strukturierte Daten. Auch „entspricht X € pro Tag“ in der Wochenmiete wird automatisch berechnet.

---

## 4. Produktfotos einfügen

Lege deine Fotos in [`src/assets/photos/`](src/assets/photos/) ab. Der Dateiname bestimmt die Position:

| Datei          | Position                                   |
| -------------- | ------------------------------------------ |
| `hero.jpg`     | Großes Bild oben (ersetzt die Zeichnung)   |
| `produkt.jpg`  | Zusätzliches Foto im Abschnitt „Der Koffer“ |
| `abholung.jpg` | Ersetzt die schematische Karte             |

Erlaubt sind `.jpg`, `.jpeg`, `.png`, `.webp` und `.avif`. Am besten große Originale (≥ 2000 px Breite) verwenden. Astro erzeugt beim Build automatisch passende, komprimierte Größen.
Solange kein Foto vorhanden ist, zeigt die Seite eine schematische Maßzeichnung des Koffers. Es werden also nie fremde oder irreführende Bilder angezeigt.

Bitte nur Fotos verwenden, an denen du die Rechte hast (am besten eigene Fotos deiner Koffer).

---

## 5. Auf GitHub Pages veröffentlichen

### Einmalig einrichten

1. Auf GitHub ein neues Repository anlegen, z. B. `fahrradkoffer-wien` (öffentlich, sonst braucht GitHub Pages einen bezahlten Plan).
2. Projekt hochladen:

   ```bash
   git init
   git add .
   git commit -m "Erste Version"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/fahrradkoffer-wien.git
   git push -u origin main
   ```

3. Im Repository auf **Settings → Pages** gehen und bei **Build and deployment → Source** die Option **GitHub Actions** wählen.
4. Unter **Actions** läuft der Workflow „Deploy to GitHub Pages“. Danach ist die Seite erreichbar unter
   `https://DEIN-USERNAME.github.io/fahrradkoffer-wien/`

### Domain und Unterpfad werden automatisch gesetzt

Der Workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) liest Domain und Unterpfad direkt aus den GitHub-Pages-Einstellungen und übergibt sie an Astro (`SITE_URL`, `BASE_PATH`). Dadurch stimmen Canonical-URL, Open-Graph-Links, Sitemap und alle Pfade zu CSS, JavaScript und Bildern automatisch, auch wenn du:

- das Repository anders nennst,
- ein User-Repository `DEIN-USERNAME.github.io` verwendest (dann ohne Unterpfad),
- später eine eigene Domain in **Settings → Pages → Custom domain** einträgst.

Die Standardwerte in [`astro.config.mjs`](astro.config.mjs) gelten nur für lokale Builds.

### Updates veröffentlichen

Jeder `git push` auf `main` veröffentlicht automatisch die neue Version.

---

## 6. Wie das Anfrageformular funktioniert

GitHub Pages hat kein Backend. Das Formular prüft daher die Eingaben im Browser (Pflichtfelder, gültige E-Mail, kein Datum in der Vergangenheit, Ende nicht vor Beginn) und öffnet dann das E-Mail-Programm der Besucher:innen mit einer fertig ausgefüllten Nachricht an `contact.email`. Erst wenn sie diese abschicken, kommt die Anfrage bei dir an. Darauf weist die Seite deutlich hin.

Danach erscheint eine Bestätigung mit „E-Mail erneut öffnen“ und „Text kopieren“, als Hilfe für alle, die kein E-Mail-Programm eingerichtet haben. Ohne JavaScript fällt das Formular auf ein einfaches `mailto:`-Formular zurück.

---

## Projektstruktur

```
site.config.ts              ← alle Inhalte & Preise
astro.config.mjs            ← Domain / Unterpfad (lokal)
src/
  pages/                    ← index, impressum, datenschutz, 404, sitemap.xml, robots.txt
  layouts/Base.astro        ← <head>, SEO, Open Graph, JSON-LD
  components/               ← Hero, Benefits, Product, Pricing, Steps, Inquiry, Location, Faq, Footer …
  scripts/                  ← Menü, Scroll-Effekte, Anfrage-Logik (wenig JavaScript)
  styles/global.css         ← Farben, Typografie, Buttons
  assets/photos/            ← deine Fotos
public/                     ← favicon.svg, apple-touch-icon.png, og-image.png
.github/workflows/deploy.yml
```

## Hinweise

- `robots.txt` wird von Suchmaschinen nur im Wurzelverzeichnis einer Domain gelesen. Bei einer Projektseite (`…github.io/fahrradkoffer-wien/`) ist sie daher wirkungslos, aber unschädlich. Mit eigener Domain oder User-Repository greift sie. Die Sitemap kannst du zusätzlich in der [Google Search Console](https://search.google.com/search-console) einreichen.
- Farben und Schriften findest du als CSS-Variablen ganz oben in `src/styles/global.css`.
