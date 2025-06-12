const CACHE_NAME = 'alcohol-v1';
const FILES = [
  '/',
  '/index.html',
  '/drink_icon.png',
  '/drink_image.png',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(res =>
      res || fetch(e.request).then(net => {
        const copy = net.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        return net;
      })
    )
  );
});