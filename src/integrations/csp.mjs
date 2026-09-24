import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Astro's built-in CSP emits a per-page policy, but <ClientRouter /> swaps
// pages without reloading, so the first page's policy would block every
// later page's inline scripts. Instead: hash every inline script across the
// whole build and give each page the same site-wide policy.
const INLINE_SCRIPT = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi;

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      // The CMS admin loads its editor from a CDN and is noindexed; it gets
      // the header-level protections from vercel.json only.
      if (entry.name !== 'admin') out.push(...(await htmlFiles(p)));
    } else if (entry.name.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

function analyticsSources(env) {
  const script = [];
  const connect = [];
  if (env.PUBLIC_CF_BEACON_TOKEN) {
    script.push('https://static.cloudflareinsights.com');
    connect.push('https://cloudflareinsights.com');
  }
  if (env.PUBLIC_PLAUSIBLE_DOMAIN) {
    script.push('https://plausible.io');
    connect.push('https://plausible.io');
  }
  if (env.PUBLIC_GOATCOUNTER) {
    script.push('https://gc.zgo.at');
    try { connect.push(new URL(env.PUBLIC_GOATCOUNTER).origin); } catch { /* malformed: leave it blocked */ }
  }
  return { script, connect };
}

export default function siteCsp({ env = {} } = {}) {
  return {
    name: 'site-csp',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const files = await htmlFiles(fileURLToPath(dir));
        const pages = await Promise.all(files.map(async (f) => [f, await readFile(f, 'utf8')]));

        const hashes = new Set();
        for (const [, html] of pages) {
          for (const [, attrs = '', body] of html.matchAll(INLINE_SCRIPT)) {
            if (/\ssrc\s*=/i.test(attrs)) continue;
            if (/type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs)) continue;
            hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
          }
        }

        const extra = analyticsSources(env);
        const policy = [
          "default-src 'self'",
          ['script-src', "'self'", ...hashes, ...extra.script].join(' '),
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          ['connect-src', "'self'", ...extra.connect].join(' '),
          'frame-src https://open.spotify.com',
          "form-action 'self' https://api.web3forms.com",
          "base-uri 'self'",
          "object-src 'none'",
          "manifest-src 'self'",
          "worker-src 'self'",
          'upgrade-insecure-requests',
        ].join('; ');
        const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}">`;

        let written = 0;
        for (const [file, html] of pages) {
          const withMeta = /<meta charset="utf-8"\s*\/?>/i.test(html)
            ? html.replace(/<meta charset="utf-8"\s*\/?>/i, (m) => m + meta)
            : html.replace(/<head>/i, (m) => m + meta);
          if (withMeta !== html) { await writeFile(file, withMeta); written++; }
        }
        logger.info(`CSP: ${hashes.size} inline script hashes applied to ${written} pages`);
      },
    },
  };
}
