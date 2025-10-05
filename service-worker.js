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


// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((resp) => 
        resp || caches.match("/Desain-Web/offline.html")
      )
    )
  );
});