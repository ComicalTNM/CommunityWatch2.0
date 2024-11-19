self.addEventListener('install', () => {
    console.log('Service worker installed');
    window.alert("Ayyy service worker installed");
});

self.addEventListener('activate', () => {
    window.alert("Ayyy service worker activated");
    console.log('Service worker activated');
});

self.addEventListener('fetch', (event) => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(fetch(event.request));
});