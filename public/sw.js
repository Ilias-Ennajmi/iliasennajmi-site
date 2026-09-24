// Offline-reading service worker.
// - Pages: network-first, so readers always get the latest version, but if
//   the network hasn't answered within NAV_TIMEOUT and a cached copy exists,
//   serve that immediately (the network response still refreshes the cache).
//   Some routes to the host can hang for 20+ seconds before failing; a
//   returning reader shouldn't have to wait that out for a page they've read.
// - /_astro/*: hashed filenames, immutable, so cache-first is safe.
// - Other static files (site-fx.js, logo-mark.svg, ...) keep the same name
//   across deploys, so they're stale-while-revalidate: instant from cache,
//   and updated in the background for next time. (v1 served them
//   cache-first forever, so returning readers never saw updates.)
const CACHE = 'site-v2';
const NAV_TIMEOUT = 3500;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function put(req, res) {
  if (!res || !res.ok || res.type === 'opaque') return;
  const copy = res.clone();
  caches.open(CACHE).then((c) => c.put(req, copy));
}

function navigate(event) {
  const req = event.request;
  const network = fetch(req).then((res) => { put(req, res); return res; });
  event.waitUntil(network.catch(() => {}));
  return caches.match(req).then((cached) => {
    if (!cached) return network.catch(() => caches.match('/404.html'));
    const timeout = new Promise((resolve) => setTimeout(() => resolve(cached), NAV_TIMEOUT));
    return Promise.race([network.catch(() => cached), timeout]);
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(navigate(event));
    return;
  }

  if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => { put(req, res); return res; }))
    );
    return;
  }

  if (/\.(css|js|woff2?|png|jpg|jpeg|svg|webp|json)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req).then((res) => { put(req, res); return res; });
        if (cached) { event.waitUntil(network.catch(() => {})); return cached; }
        return network;
      })
    );
  }
});
