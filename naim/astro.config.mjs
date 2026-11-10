// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Change this to Naim's real domain once it's bought.
  site: process.env.SITE_URL || 'https://naim.example.com',
  build: { inlineStylesheets: 'always' },
  vite: {
    // This project lives inside another repo: pin Vite to this folder's
    // tsconfig so it never reads the parent site's one.
    tsconfig: './tsconfig.json',
    resolve: { tsconfigPaths: false },
  },
});
