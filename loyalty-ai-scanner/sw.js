const CACHE_NAME = 'loyalty-ai-v1';
const ASSETS = [
    './',
    './index.html',
    './css/main.css',
    './js/app.js',
    './manifest.json',
    './assets/let-her-go.mp3',
    './assets/no-no-wait-wait.mp3',
    './assets/infiel.mp3'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
