const CACHE_NAME = "teguh-pwa-v2";
const urlsToCache = [     
  "/Desain-Web/",                       
  "/Desain-Web/index.html",
  "/Desain-Web/about.html",
  "/Desain-Web/contact.html",
  "/Desain-Web/offline.html",
  "/Desain-Web/style.css",
  "/Desain-Web/icons/icon-192.png",
  "/Desain-Web/icons/icon-512.png"
];


// Install event: cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to offline.html for navigation
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response || caches.match("/Desain-Web/offline.html");
        })
        .catch(() => caches.match("/Desain-Web/offline.html"))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).catch(() => {
            // Optionally, fallback for other requests
          })
        );
      })
    );
  }
});

