'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { templates } from '@/components/templates';
import { QRCodeCanvas } from 'qrcode.react';
import { Share2, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { PasswordCheck } from '@/components/PasswordCheck';

interface PageData {
  nome1: string;
  nome2: string;
  data: string;
  mensagem: string;
  fotos: string[];
  musica?: string;
  template: 'romantico' | 'moderno' | 'minimalista';
  isPago: boolean;
  isPrivate?: boolean;
  password?: string;
}

export default function Page() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  const fullUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/pages${pathname}`);
        if (!response.ok) throw new Error('Página não encontrada');
        const data = await response.json();
        setPageData(data);
        setIsAuthenticated(!data.isPrivate);
      } catch (error) {
        console.error('Error loading page:', error);
        toast.error('Erro ao carregar página');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-romantic-500"></div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-romantic-800 mb-2">
            Página não encontrada
          </h1>
          <p className="text-romantic-600">
            O link que você acessou não existe ou expirou
          </p>
        </div>
      </div>
    );
  }

  if (!pageData.isPago) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-romantic-800 mb-2">
            Página em processamento
          </h1>
          <p className="text-romantic-600">
            Aguarde enquanto processamos seu pagamento
          </p>
        </div>
      </div>
    );
  }

  if (pageData.isPrivate && !isAuthenticated) {
    return (
      <PasswordCheck
        onSuccess={() => setIsAuthenticated(true)}
        correctPassword={pageData.password || ''}
      />
    );
  }

  const Template = templates[pageData.template];

  const handleShare = async () => {
    try {
      const text =
        `💑 Queremos compartilhar nossa história de amor com você! ✨\n\n` +
        `${pageData.nome1} & ${pageData.nome2} criaram uma página especial para eternizar momentos únicos.\n\n` +
        `💝 Faça parte dessa história de amor:\n${fullUrl}`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    } catch {
      toast.error('Erro ao compartilhar');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${pageData.nome1} & ${pageData.nome2}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
            }
            h1 {
              color: #1f2937;
              font-size: 24px;
              margin-bottom: 24px;
              text-align: center;
            }
            p {
              color: #6b7280;
              margin-top: 16px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>${pageData.nome1} & ${pageData.nome2}</h1>
          <div id="qr-canvas"></div>
          <p>Escaneie para acessar nossa página</p>
          <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
          <script>
            var qr = qrcode(0, 'H');
            qr.addData('${fullUrl}');
            qr.make();
            document.getElementById('qr-canvas').innerHTML = qr.createImgTag(8);
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${pageData.nome1} & ${pageData.nome2} - Nossa História de Amor`,
    description: pageData.mensagem,
    url: fullUrl,
    image: pageData.fotos[0],
    datePublished: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: `${pageData.nome1} e ${pageData.nome2}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'O Nosso Pra Sempre',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="hidden">
        <div id="qr-code">
          <QRCodeCanvas value={fullUrl} size={200} />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="fixed bottom-6 right-6 flex gap-2">
        <button
          onClick={handleShare}
          className="p-2 bg-romantic-500 text-white rounded-full shadow-lg hover:bg-romantic-600 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={handlePrint}
          className="p-2 bg-romantic-500 text-white rounded-full shadow-lg hover:bg-romantic-600 transition-colors"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {/* Template */}
      <Template {...pageData} />
    </>
  );
}
