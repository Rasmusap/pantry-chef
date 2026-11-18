// Bentes køkken service worker: makes the installed web app work offline.
// Network first (so friends always get the newest version when online), cache as the fallback.
// tools/build_web.py replaces the version below with a hash of the files, so old caches get cleaned up.
const VERSION = '7382e352f513';
const CACHE = `pantry-chef-${VERSION}`;
const FILES = ['./', 'index.html', 'privacy.html', 'style.css', 'data.js', 'i18n.js', 'core.js', 'app.js', 'manifest.webmanifest', 'offers.json',
  'recipes/words.js', 'recipes/batch-1.js', 'recipes/batch-2.js', 'recipes/batch-3.js', 'recipes/batch-4.js', 'recipes/batch-5.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('pantry-chef-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch(req, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch {
      const hit = await cache.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' && await cache.match('index.html'));
      return hit || Response.error();
    }
  })());
});
