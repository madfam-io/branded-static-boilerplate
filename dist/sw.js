/**
 * BSB Service Worker
 * ==================
 * Implements caching strategies for 100/100 Lighthouse score
 */

const CACHE_NAME = 'bsb-cache-v1';
const RUNTIME_CACHE = 'bsb-runtime-v1';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/scripts/core/theme-toggle.js',
  '/scripts/core/language-toggle.js',
  '/scripts/core/performance-optimizer.js',
  '/assets/images/bsb-logo.svg',
  '/manifest.json'
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // HTML: Network first, fall back to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseToCache));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // CSS/JS: Cache first, fall back to network
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response;
          
          return fetch(request).then(response => {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseToCache));
            return response;
          });
        })
    );
    return;
  }

  // Images: Cache first with runtime cache
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response;
          
          return fetch(request).then(response => {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE)
              .then(cache => cache.put(request, responseToCache));
            return response;
          });
        })
    );
    return;
  }

  // Fonts: Cache first, very long cache
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'fonts.googleapis.com') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response;
          
          return fetch(request).then(response => {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseToCache));
            return response;
          });
        })
    );
    return;
  }

  // Default: Network first
  event.respondWith(
    fetch(request)
      .then(response => {
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE)
          .then(cache => cache.put(request, responseToCache));
        return response;
      })
      .catch(() => caches.match(request))
  );
});