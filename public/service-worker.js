/* eslint-disable no-restricted-globals */
const CACHE_NAME = "app-cache-v2"; // Increment version for updates
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js", // Example JS bundle (adjust path as needed)
  "/static/css/main.css", // Example CSS file
  "/logo192.png", // Example asset for offline display
];

self.addEventListener("install", (event) => {
  // Cache all important files during installation
   console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache and storing files");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the new service worker and clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // Keep only the latest cache
          .map((name) => caches.delete(name))
      )
    )
  );
  console.log("Service Worker activated");
});

// Intercept network requests and serve cached versions if available
self.addEventListener("fetch", (event) => {
  console.log(`[ServiceWorker] Fetching: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // Optional: Display offline fallback content
          if (event.request.destination === "document") {
            return caches.match("/index.html"); // Fallback to home page if offline
          }
        })
      );
    })
  );
});
