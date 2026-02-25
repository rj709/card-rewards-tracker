const CACHE = 'crt-v1';
const ASSETS = [
  '/card-rewards-tracker/card-rewards-tracker.html',
  '/card-rewards-tracker/manifest.json',
  '/card-rewards-tracker/icon-192.png',
  '/card-rewards-tracker/icon-512.png',
  '/card-rewards-tracker/apple-touch-icon.png',
];

// Pre-cache all assets on install
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Remove old caches on activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
