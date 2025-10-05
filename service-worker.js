const CACHE_NAME = "teguh-pwa-v2";
const urlsToCache = [                            
  "index.html",
  "about.html",
  "contact.html",
  "offline.html",
  "style.css",
  "icons/icon-192.png",
  "icons/icon-512.png"
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
          return response || caches.match("offline.html");
        })
        .catch(() => caches.match("offline.html"))
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

