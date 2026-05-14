const CACHE_NAME = 'lp-admin-v1';
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
});

self.addEventListener('fetch', (e) => {
    // Admin content should be fresh, so we use Network First or bypass cache for API calls
    if (e.request.url.includes('supabase.co')) {
        return fetch(e.request);
    }
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
