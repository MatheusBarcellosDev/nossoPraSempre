import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { PlanProvider } from '@/contexts/PlanContext';
import { Toaster } from 'sonner';
import CloudinaryConfig from '@/components/CloudinaryConfig';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'O Nosso Pra Sempre',
  description:
    'Crie uma página única e especial para celebrar sua história de amor.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/favicon-48x48.png"
        />
        <meta
          name="google-site-verification"
          content="6jHrU9skNVLFmFeLhTdCsebqC8RPoA-fOR1z"
        />
        <style>{`
          html, body {
            touch-action: manipulation;
          }
          input, textarea, select {
            font-size: 16px !important;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <PlanProvider>
          <CloudinaryConfig />
          {children}
          <Toaster richColors position="top-right" />
        </PlanProvider>
        <Analytics />
      </body>
    </html>
  );
}
