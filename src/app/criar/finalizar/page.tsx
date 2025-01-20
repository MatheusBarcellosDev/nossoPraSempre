'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QRCodeCanvas } from 'qrcode.react';
import { Share2, Copy, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { templates, TemplateType } from '@/components/templates';

const PLANS = {
  basic: {
    type: 'basic',
    maxPhotos: 3,
    duration: '1 ano',
    price: 19.9,
  },
  premium: {
    type: 'premium',
    maxPhotos: 6,
    duration: 'vitalício',
    price: 29.9,
  },
} as const;

interface PageData {
  id: string;
  nome1: string;
  nome2: string;
  data: string;
  mensagem: string;
  template: TemplateType;
  musica: string;
  fotos: string[];
  slug: string;
  plano: keyof typeof PLANS;
  isPago: boolean;
  createdAt: string;
}

export default function FinalizarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  useEffect(() => {
    if (!slug) {
      router.push('/');
      return;
    }

    const fetchPageData = async () => {
      try {
        const response = await fetch(`/api/pages/${slug}`);
        if (!response.ok) {
          throw new Error('Página não encontrada');
        }
        const data = await response.json();
        setPageData(data);
      } catch {
        toast.error('Erro ao carregar a página');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [slug, router]);

  const handlePayment = async () => {
    if (!pageData) return;

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: pageData.slug,
          plano: pageData.plano,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar sessão de pagamento');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch {
      toast.error('Erro ao processar pagamento');
    }
  };

  const handleShare = () => {
    const fullUrl = `${window.location.origin}/${pageData?.slug}`;
    const message = `Olá! Venha conferir nossa página de casamento: ${fullUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/${pageData?.slug}`;
    try {
      navigator.clipboard.writeText(fullUrl);
      toast.success('Link copiado!');
    } catch {
      toast.error('Erro ao copiar link');
    }
  };

  const handlePrintQRCode = () => {
    const qrWindow = window.open('', '_blank');
    if (!qrWindow) return;

    const fullUrl = `${window.location.origin}/${pageData?.slug}`;
    const qrCodeHtml = `
      <div style="display: flex; justify-content: center;">
        <canvas id="qr-canvas"></canvas>
      </div>
    `;

    const html = `
      <html>
        <head>
          <title>QR Code - ${pageData?.nome1} e ${pageData?.nome2}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: system, -apple-system, sans-serif;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #333;
            }
            #qr-container {
              margin-bottom: 20px;
            }
            p {
              font-size: 16px;
              color: #666;
              text-align: center;
              max-width: 400px;
            }
            @media print {
              body {
                height: auto;
                padding: 40px 0;
              }
            }
          </style>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode.react/3.1.0/qrcode.min.js"></script>
        </head>
        <body>
          <h1>${pageData?.nome1} e ${pageData?.nome2}</h1>
          <div id="qr-container">
            ${qrCodeHtml}
          </div>
          <p>Escaneie o QR Code acima para acessar nossa página de casamento</p>
          <script>
            new QRCode(document.getElementById('qr-canvas'), {
              text: '${fullUrl}',
              width: 200,
              height: 200,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            });
            setTimeout(() => window.print(), 500);
          </script>
        </body>
      </html>
    `;

    qrWindow.document.write(html);
    qrWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-romantic-200 border-t-romantic-500 rounded-full animate-spin mx-auto" />
          <p className="text-romantic-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-romantic-600">Página não encontrada</p>
          <Button onClick={() => router.push('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const Template = templates[pageData.template];

  return (
    <div className="min-h-screen bg-romantic-50/50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <Template {...pageData} />

        <Card className="p-6 space-y-6 bg-white/90 backdrop-blur">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-romantic-800">
              Compartilhe sua página
            </h2>
            <p className="text-romantic-600">
              Use uma das opções abaixo para compartilhar com seus convidados
            </p>
          </div>

          <div
            className={`${
              !pageData.isPago ? 'blur-sm pointer-events-none opacity-40' : ''
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePrintQRCode}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir QR Code
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4 mt-6">
              <div id="qrcode">
                <QRCodeCanvas
                  value={`${window.location.origin}/${pageData.slug}`}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              <p className="text-sm text-romantic-500">
                Escaneie para acessar a página
              </p>
            </div>
          </div>

          {!pageData.isPago && (
            <div className="bg-white/95 backdrop-blur p-6 rounded-lg">
              <div className="text-center space-y-4 max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-romantic-800">
                  Prévia da sua página
                </h2>
                <p className="text-romantic-600">
                  Sua página está quase pronta! Faça o pagamento para liberar o
                  acesso completo.
                </p>
                <div className="text-center">
                  <p className="text-lg font-medium text-romantic-700 mb-2">
                    {pageData.plano === 'basic'
                      ? 'Plano Básico'
                      : 'Plano Premium'}
                  </p>
                  <p className="text-3xl font-bold text-romantic-800 mb-1">
                    R$ {PLANS[pageData.plano].price.toFixed(2)}
                  </p>
                  <p className="text-romantic-500 mb-4">
                    {PLANS[pageData.plano].duration === 'vitalício'
                      ? 'Acesso vitalício'
                      : `Acesso por ${PLANS[pageData.plano].duration}`}
                  </p>
                  <Button className="w-full" onClick={handlePayment}>
                    Liberar minha página
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
