// Book Shelf service worker: keeps the app itself working without internet.
// Books, Google Drive and Firebase are never cached here (the app keeps books in its own storage).
// Only caches named bookshelf-* are ever removed, so other apps on the same github.io site keep theirs.
const VERSION = 'bookshelf-v1.0.6';
const SHELL = ['./', './index.html', './manifest.json', './config.js', './demo-data.js', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './lib/pdf.min.js', './lib/pdf.worker.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('bookshelf-') && k !== VERSION && k !== 'bookshelf-fonts').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('bookshelf-fonts').then(async c => { const hit = await c.match(req); if (hit) return hit; try { const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; } catch (err) { return hit || Response.error(); } }));
    return;
  }
  if (url.origin !== location.origin) return;
  if (url.pathname.includes('/lib/')) {
    // libraries never change inside one version: cache first
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; })));
    return;
  }
  // app files: network first so updates arrive, cache when offline
  e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});
