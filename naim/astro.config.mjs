// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Change this to Naim's real domain once it's bought.
  // SITE_URL wins; otherwise the host's own production URL (Vercel or Netlify).
  site:
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    process.env.URL ||
    'https://naim-dj.vercel.app',
  build: { inlineStylesheets: 'always' },
  vite: {
    // This project lives inside another repo: pin Vite to this folder's
    // tsconfig so it never reads the parent site's one.
    tsconfig: './tsconfig.json',
    resolve: { tsconfigPaths: false },
  },
});
