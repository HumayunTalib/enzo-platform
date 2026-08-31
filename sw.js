/* ============================================================
   ENZO — service worker.
   The point of this is narrow: the fabric costing calculator has
   to work at a counter with no signal. Everything else gets a
   light shell cache; nothing that changes gets cached at all.

   Bump SW_VERSION on any deploy that changes a precached file.
   ============================================================ */
var SW_VERSION = 'enzo-v8';
var PRECACHE   = SW_VERSION + '-precache';
var RUNTIME    = SW_VERSION + '-runtime';

/* The calculator and exactly what it needs to run. */
var PRECACHE_URLS = [
  '/calculator.html',
  '/output.css?v=8',
  '/js/nav.js',
  '/js/motion.js',
  '/js/calculator.js',
  '/js/pwa.js',
  '/manifest.json',
  '/assets/logo/favicon-192.png',
  '/assets/logo/favicon-512.png'
];

/* Never cached: content that changes independently of a deploy, and
   anything that would be wrong to serve stale. */
function neverCache(url) {
  return url.pathname.indexOf('/journal/') === 0 ||
         url.pathname.indexOf('/data/')    === 0 ||
         url.pathname === '/sitemap.xml'   ||
         url.pathname === '/robots.txt';
}

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(PRECACHE)
      // addAll fails the whole install if any single URL 404s; add
      // individually so one missing asset cannot break offline support.
      .then(function (c) {
        return Promise.all(PRECACHE_URLS.map(function (u) {
          return c.add(u).catch(function () { /* skip, not fatal */ });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      // Drop every cache from a previous SW_VERSION, so a deploy cannot
      // leave anyone pinned to stale files.
      return Promise.all(keys.filter(function (k) {
        return k.indexOf(SW_VERSION) !== 0;
      }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // fonts, Formspree, wa.me
  if (neverCache(url)) return;

  var isHTML = req.mode === 'navigate' ||
               (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isHTML) {
    // Network first: a new deploy is picked up the moment there is a
    // connection. The cache is the fallback, not the default.
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match('/calculator.html');
        });
      })
    );
    return;
  }

  // Static assets: serve fast from cache, refresh in the background.
  // output.css and the stylesheet link carry ?v=, so a new build is a
  // new URL and cannot be shadowed by an old entry.
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
