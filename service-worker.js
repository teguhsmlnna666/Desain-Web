const CACHE_NAME = "teguh-pwa-v3";
const urlsToCache = [     
  "./",
  "index.html",
  "about.html",
  "contact.html",
  "offline.html",
  "style.css",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

// Install event → cache semua file penting
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event → hapus cache lama
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

// Fetch event → fallback ke offline.html saat tidak ada koneksi
self.addEventListener("fetch", (event) => {
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" &&
      event.request.headers.get("accept")?.includes("text/html")) ||
    event.request.destination === "document"
  ) {
    // Fallback untuk halaman HTML
    event.respondWith(
      fetch(event.request).catch(() => caches.match("offline.html"))
    );
  } else {
    // Untuk asset (css, js, gambar, dll.)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
