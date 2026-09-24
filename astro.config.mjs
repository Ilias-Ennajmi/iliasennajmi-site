// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import siteCsp from './src/integrations/csp.mjs';

const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_'), ...process.env };

// Vercel injects this automatically at build time, set to whatever domain is
// currently assigned as the project's production domain.
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

// https://astro.build/config
export default defineConfig({
  // Canonical tags, OG image URLs, the sitemap and RSS all derive from this.
  // The fallback is the real domain, not a host-specific one: any other build
  // of this repo (the old Netlify project still auto-builds it) must point
  // search engines back here rather than claim to be the original.
  site: process.env.SITE_URL || vercelProductionUrl || 'https://www.ennajmi.space',
  trailingSlash: 'always',
  integrations: [sitemap(), siteCsp({ env })],
  build: {
    // One global stylesheet (~5 KB gzipped). Inlining it removes a
    // render-blocking round trip, which costs ~250 ms on the high-latency
    // connections a lot of this site's readers are on.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // Keep component scripts as files instead of inlining the small ones.
      // With any inline module script on a page, <ClientRouter /> injects a
      // `data:` script as a timing sentinel during navigation, which the CSP
      // (rightly) blocks. As files they're also cached across pages.
      assetsInlineLimit: 0,
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
