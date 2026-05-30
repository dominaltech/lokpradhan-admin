const CACHE_NAME = 'lp-admin-v2';
const ASSETS = [
    'index.html',
    'manifest.json',
    'pwa.js',
    'admin.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (e) => {
    // Delete old caches so the new SW takes effect right away
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // NEVER intercept Supabase API calls — let the browser handle them directly.
    // Previously this code did `return fetch(e.request)` without calling
    // e.respondWith(), which caused BOTH the SW and the browser to each fire
    // their own fetch — resulting in 2 POST requests and duplicate DB records.
    if (e.request.url.includes('supabase.co')) {
        return; // Do NOT call e.respondWith(). Browser handles it once, natively.
    }

    // For all other requests: network first, fall back to cache
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});

