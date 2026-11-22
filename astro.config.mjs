// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Domain und Unterpfad der fertigen Website.
 *
 * Beim Deployment über GitHub Actions werden beide Werte automatisch
 * aus den GitHub-Pages-Einstellungen gesetzt (siehe .github/workflows/deploy.yml).
 * Die Standardwerte unten gelten nur für lokale Builds.
 */
const SITE_URL = process.env.SITE_URL || 'https://USERNAME.github.io';
const BASE_PATH = process.env.BASE_PATH ?? '/fahrradkoffer-wien';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH || '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
});
