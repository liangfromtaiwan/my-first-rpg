// 抱石村 service worker: makes the site installable and opens quickly, without ever pinning an
// old version. Pages and code are fetched from the network first (so every update shows up
// right away) and cached as a fallback; images are served from cache and refreshed behind.
// Other sites (Firebase, YouTube, Google fonts, video calls) are never touched.
const CACHE = "boulder-village-v1";
const SHELL = ["./", "./index.html", "./offline.html", "./manifest.webmanifest", "./image/brand/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const putInCache = (request, response) => {
  if (response && response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(CACHE).then((c) => c.put(request, copy));
  }
  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Firebase, YouTube, fonts…: straight to the network

  // Pages: network first, then the cached page, then the friendly offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => putInCache(request, res))
        .catch(() => caches.match(request).then((hit) => hit || caches.match("./index.html")).then((hit) => hit || caches.match("./offline.html")))
    );
    return;
  }

  // Images: cache first (they rarely change), refreshed in the background
  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then((hit) => {
        const fresh = fetch(request).then((res) => putInCache(request, res)).catch(() => hit);
        return hit || fresh;
      })
    );
    return;
  }

  // Code and everything else: network first, cache as the fallback when offline
  event.respondWith(fetch(request).then((res) => putInCache(request, res)).catch(() => caches.match(request)));
});
