import type { APIRoute } from 'astro';

// Generated rather than static so the sitemap URL follows astro.config's
// `site` (and therefore SITE_URL) instead of hardcoding a domain.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).toString();
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
