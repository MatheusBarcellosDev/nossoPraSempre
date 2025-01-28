'use client';

export function ServiceWorkerRegistration({ slug }: { slug: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/${slug}/sw.js', {
                scope: '/${slug}'
              });
            });
          }
        `,
      }}
    />
  );
}
