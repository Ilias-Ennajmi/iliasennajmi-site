// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Vercel injects this automatically at build time, set to whatever domain is
// currently assigned as the project's production domain (the custom domain
// once one is attached, the *.vercel.app one otherwise) — no dashboard env
// var to remember to set or keep in sync as the domain changes.
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

// https://astro.build/config
export default defineConfig({
  // Where the site actually lives today. Canonical tags, OG image URLs, the
  // sitemap and RSS all derive from this, so a wrong value breaks every
  // share preview. Precedence: an explicit SITE_URL override (works on any
  // host), then Vercel's auto-provided production domain, then the Netlify
  // fallback this site started on.
  site: process.env.SITE_URL || vercelProductionUrl || 'https://iliasennajmi-site.netlify.app',
  trailingSlash: 'always',
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
