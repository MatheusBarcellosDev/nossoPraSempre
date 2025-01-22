import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { PlanProvider } from '@/contexts/PlanContext';
import { Toaster } from 'sonner';
import CloudinaryConfig from '@/components/CloudinaryConfig';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'O Nosso Pra Sempre',
  description:
    'Crie uma página única e especial para celebrar sua história de amor.',
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
      </head>
      <body className={inter.className}>
        <PlanProvider>
          <CloudinaryConfig />
          {children}
          <Toaster richColors position="top-right" />
        </PlanProvider>
      </body>
    </html>
  );
}
