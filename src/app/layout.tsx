import './globals.css';
import { Inter } from 'next/font/google';
import { PlanProvider } from '@/contexts/PlanContext';
import { Toaster } from 'sonner';
import CloudinaryConfig from '@/components/CloudinaryConfig';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Meu Casal',
  description: 'Crie uma página personalizada para seu amor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
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
