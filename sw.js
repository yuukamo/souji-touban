// 当番表ジェネレーターのオフライン用キャッシュ。
// 表示に必要なファイルは数個しかないので、インストール時にまとめて取得しておく。
// 中身を変えたら CACHE の版を上げること（古いキャッシュは activate で消える）。
const CACHE = "duty-wheel-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  // ページ遷移はネットワークを先に試し、圏外ならキャッシュの index.html を返す
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html", { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req))
  );
});
