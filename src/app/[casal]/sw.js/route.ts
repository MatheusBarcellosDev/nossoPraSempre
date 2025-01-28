import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { casal: string } }
) {
  const sw = `
    const CACHE_NAME = 'nosso-pra-sempre-${params.casal}';
    const OFFLINE_URL = '/${params.casal}';

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll([
            OFFLINE_URL,
            '/icon-192x192.png',
            '/icon-512x512.png',
          ]);
        })
      );
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames
              .filter((name) => name.startsWith('nosso-pra-sempre-'))
              .filter((name) => name !== CACHE_NAME)
              .map((name) => caches.delete(name))
          );
        })
      );
    });

    self.addEventListener('fetch', (event) => {
      if (event.request.mode === 'navigate') {
        event.respondWith(
          fetch(event.request).catch(() => {
            return caches.match(OFFLINE_URL);
          })
        );
        return;
      }

      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
      );
    });
  `;

  return new NextResponse(sw, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
