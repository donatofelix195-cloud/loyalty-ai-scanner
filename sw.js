const CACHE_NAME = 'loyalty-ai-v1';
const ASSETS = [
    './',
    './index.html',
    './css/main.css',
    './js/app.js',
    './manifest.json',
    './assets/let-her-go.mp3',
    './assets/angel-choir.mp3',
    './assets/siuuu.mp3',
    './assets/viva-venezuela.mp3',
    './assets/no-no-wait-wait.mp3',
    './assets/infiel.mp3',
    './assets/infiel-drama.mp3',
    './assets/emotional-damage.mp3',
    './assets/expropiese.mp3',
    './assets/gta-wasted.mp3',
    './assets/maduro-rolo.mp3',
    './assets/mamaguevo.mp3',
    './assets/oh-no-tiktok-v2.mp3'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Attempt to cache all assets, but don't fail installation if one fails
            return Promise.all(
                ASSETS.map(url => {
                    return cache.add(url).catch(err => {
                        console.warn('Failed to cache asset:', url, err);
                        return null; // Continue even if one fails
                    });
                })
            );
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
