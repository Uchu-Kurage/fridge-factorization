'use strict';

// ============================================================
// 冷蔵庫☆因数分解 — Service Worker
// アプリシェルをキャッシュしてオフライン動作を可能にします。
// データ自体は localStorage に保存されるため、シェルさえ
// キャッシュできればオフラインでも完全に動作します。
// ============================================================

// キャッシュを更新したいときはこのバージョンを上げる
const CACHE_VERSION = 'v2';
const CACHE_NAME = `fridge-factorization-${CACHE_VERSION}`;

// 事前キャッシュするアプリシェル
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

// 実行時に取得したもの（Google Fonts など）を入れるキャッシュ
const RUNTIME_CACHE = `fridge-runtime-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ページからのメッセージで即時更新に対応
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // GET 以外は素通し
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // ページ遷移（HTML）: ネットワーク優先・失敗時はキャッシュした index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // 同一オリジンの静的アセット: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // クロスオリジン（Google Fonts 等）: キャッシュ優先＋バックグラウンド更新
  event.respondWith(
    caches.open(RUNTIME_CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            // opaque レスポンス(status 0)も含めてキャッシュ
            if (response && (response.status === 200 || response.type === 'opaque')) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
