// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Where the site actually lives today. Set SITE_URL in Netlify's env when
  // a custom domain is wired up — canonical tags, OG image URLs, the sitemap
  // and RSS all derive from this, so a wrong value breaks every share preview.
  site: process.env.SITE_URL || 'https://iliasennajmi-site.netlify.app',
  trailingSlash: 'always',
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
