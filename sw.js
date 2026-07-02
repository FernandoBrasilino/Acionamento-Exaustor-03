const CACHE_NAME = 'exaustor-cache-torre03-v2';
const urlsToCache = ['./', './index.html', './manifest.json', './logogiglio.png'];

// Instala o Service Worker e armazena os arquivos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// Remove caches antigos (inclusive o da Torre 02) para forçar a atualização
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Serve os arquivos do cache, mas busca na rede se não encontrar
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
