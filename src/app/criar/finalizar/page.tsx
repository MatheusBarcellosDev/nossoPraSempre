'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Copy, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { templates, TemplateType } from '@/components/templates';
import { QRCodeCanvas } from 'qrcode.react';

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
    price: 24.9,
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

function FinalizarContent() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutos em segundos
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  useEffect(() => {
    if (!slug) {
      router.push('/');
      return;
    }

    const fetchTempData = async () => {
      try {
        const response = await fetch(`/api/temp-data?key=${slug}`);
        if (!response.ok) {
          throw new Error('Dados temporários não encontrados');
        }

        const { data } = await response.json();
        setPageData(data);
        setIsLoading(false);
      } catch (error) {
        toast.error('Erro ao carregar dados temporários');
        router.push('/');
      }
    };

    fetchTempData();
  }, [slug, router]);

  // Timer para expiração
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePayment = async () => {
    if (!pageData) return;
    setIsProcessingPayment(true);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: slug,
          plano: pageData.plano,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Payment error details:', error);
        throw new Error(error.error || 'Erro ao criar sessão de pagamento');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de pagamento não encontrada');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao processar pagamento'
      );
      setIsProcessingPayment(false);
    }
  };

  const handleShare = () => {
    const fullUrl = `${window.location.origin}/${pageData?.slug}`;
    const message = `Venha conhecer nossa página especial no O Nosso Pra Sempre! 💑\n\nAcesse: ${fullUrl}`;
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
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const fullUrl = `${window.location.origin}/${pageData?.slug}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${pageData?.nome1} & ${pageData?.nome2}</title>
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
              background-color: white;
            }
            .container {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
              max-width: 400px;
              aspect-ratio: 1;
              padding: 32px;
              position: relative;
            }
            .couple-names {
              font-size: 42px;
              font-weight: 600;
              color: #1f2937;
              text-align: center;
              line-height: 1.2;
              margin-bottom: 8px;
              letter-spacing: -0.02em;
            }
            .heart {
              color: #E11D48;
              font-size: 36px;
              margin: 0 12px;
              display: inline-block;
              transform: translateY(2px);
            }
            .brand {
              font-size: 18px;
              color: #6b7280;
              text-align: center;
              margin-bottom: 24px;
              letter-spacing: 0.05em;
            }
            .website {
              font-size: 12px;
              color: #9CA3AF;
              text-align: center;
              margin-top: 16px;
              letter-spacing: 0.05em;
            }
            #qr-canvas {
              margin: 0;
            }
            #qr-canvas img {
              display: block;
            }
            .print-button {
              margin-top: 32px;
              padding: 10px 20px;
              background-color: #E11D48;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              position: relative;
              z-index: 10;
            }
            .print-button:hover {
              background-color: #BE123C;
            }
            @media print {
              .print-button {
                display: none;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .container {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="couple-names">${pageData?.nome1}<span class="heart">♥</span>${pageData?.nome2}</p>
            <p class="brand">O Nosso Pra Sempre</p>
            <div id="qr-canvas"></div>
            <p class="website">www.onossoprasempre.com.br</p>
            <button class="print-button" onclick="handlePrint()">Imprimir QR Code</button>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
          <script>
            function handlePrint() {
              window.print();
            }
            
            // Gera o QR Code
            var qr = qrcode(0, 'H');
            qr.addData('${fullUrl}');
            qr.make();
            
            // Insere o QR Code na página
            document.getElementById('qr-canvas').innerHTML = qr.createImgTag(8);
            
            // Garante que o QR Code foi renderizado
            window.onload = function() {
              if (!document.getElementById('qr-canvas').innerHTML) {
                qr = qrcode(0, 'H');
                qr.addData('${fullUrl}');
                qr.make();
                document.getElementById('qr-canvas').innerHTML = qr.createImgTag(8);
              }
            };
          </script>
        </body>
      </html>
    `);

    // Fecha o documento para finalizar a escrita
    printWindow.document.close();
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
            className={!pageData.isPago ? 'blur-sm pointer-events-none' : ''}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button className="w-full" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar no WhatsApp
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

            <div className="flex flex-col items-center space-y-4 mt-8">
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
            <div className="bg-white/95 backdrop-blur p-6 rounded-lg mt-6">
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
                  <Button
                    size="lg"
                    className="w-full text-lg py-8 bg-romantic-500 hover:bg-romantic-600 disabled:bg-romantic-400 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Liberar minha página
                        <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {!pageData?.isPago && (
        <div className="fixed top-0 left-0 right-0 bg-romantic-500 text-white py-2 text-center">
          <p className="text-sm">
            Tempo restante para finalizar: {formatTime(timeLeft)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FinalizarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-romantic-200 border-t-romantic-500 rounded-full animate-spin mx-auto" />
            <p className="text-romantic-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <FinalizarContent />
    </Suspense>
  );
}
