'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QRCodeCanvas } from 'qrcode.react';
import { Share2, Copy, Printer, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { templates } from '@/components/templates';

interface PageData {
  nome1: string;
  nome2: string;
  data: string;
  mensagem: string;
  template: string;
  musica: string | null;
  fotos: string[];
  slug: string;
  isPago: boolean;
  plano: string;
}

export default function FinalizarPage() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  useEffect(() => {
    if (!slug) {
      toast.error('Página não encontrada');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/pages?slug=${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch page data');
        }
        const data = await response.json();
        setPageData(data);
      } catch (error) {
        console.error('Error fetching page:', error);
        toast.error('Erro ao carregar a página');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-romantic-50 via-romantic-100 to-romantic-50 p-4 flex items-center justify-center">
        <p className="text-romantic-600">Carregando...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-romantic-50 via-romantic-100 to-romantic-50 p-4 flex items-center justify-center">
        <p className="text-romantic-600">Página não encontrada</p>
      </div>
    );
  }

  const fullUrl = `${process.env.NEXT_PUBLIC_URL}/${pageData.slug}`;
  const Template = templates[pageData.template as keyof typeof templates];

  const handleShare = async () => {
    if (!pageData.isPago) {
      toast.error('Faça o pagamento para compartilhar a página');
      return;
    }

    try {
      const text =
        `${pageData.nome1} criou uma página especial para celebrar seu amor com ${pageData.nome2}! 💑\n\n` +
        `Acesse a página diretamente pelo link ou escaneie o QR Code na versão impressa:\n${fullUrl}`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    } catch {
      toast.error('Erro ao compartilhar');
    }
  };

  const handleCopy = () => {
    if (!pageData.isPago) {
      toast.error('Realize o pagamento para copiar o link');
      return;
    }

    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        toast.success('Link copiado para a área de transferência!');
      })
      .catch((error) => {
        console.error('Error copying:', error);
        toast.error('Erro ao copiar o link');
      });
  };

  const handlePrint = () => {
    if (!pageData.isPago) {
      toast.error('Faça o pagamento para imprimir o QR Code');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${pageData.nome1} & ${pageData.nome2}</title>
          <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
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
            .container {
              text-align: center;
            }
            h1 {
              color: #666;
              font-weight: 300;
              margin-bottom: 2rem;
            }
            .qr-code {
              padding: 20px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${pageData.nome1} & ${pageData.nome2}</h1>
            <div class="qr-code">
              <div id="qr"></div>
            </div>
          </div>
          <script>
            // Aguarda o carregamento da biblioteca
            window.onload = function() {
              new QRCode(document.getElementById("qr"), {
                text: "${fullUrl}",
                width: 200,
                height: 200
              });
              
              // Aguarda o QR code ser renderizado
              setTimeout(() => {
                window.print();
                window.close();
              }, 200);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

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

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento');
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-50 via-romantic-100 to-romantic-50 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="p-8">
            <h1 className="text-3xl font-semibold text-romantic-800 mb-6 text-center">
              Sua Página está Pronta!
            </h1>

            <div className="space-y-8">
              {/* Preview */}
              <div className="aspect-[9/16] bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full h-full overflow-auto">
                  <Template
                    nome1={pageData.nome1}
                    nome2={pageData.nome2}
                    data={pageData.data}
                    mensagem={pageData.mensagem}
                    musica={pageData.musica || ''}
                    fotos={pageData.fotos}
                  />
                </div>
              </div>

              {/* QR Code e Link */}
              <div className="flex flex-col items-center gap-6 py-6">
                <div className="relative">
                  <div
                    className={`bg-white p-4 rounded-xl shadow-lg qr-code-print ${
                      !pageData.isPago ? 'blur-sm' : ''
                    }`}
                  >
                    <QRCodeCanvas value={fullUrl} size={200} />
                  </div>
                  {!pageData.isPago && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-romantic-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Realize o pagamento para desbloquear</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 w-full max-w-md">
                  <div className="flex items-center gap-2 relative">
                    <div
                      className={`flex-1 ${!pageData.isPago ? 'blur-sm' : ''}`}
                    >
                      <input
                        type="text"
                        value={fullUrl}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg bg-white border border-romantic-200 text-romantic-800"
                      />
                    </div>
                    <Button
                      onClick={handleCopy}
                      className={`bg-romantic-100 hover:bg-romantic-200 text-romantic-700 ${
                        !pageData.isPago ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleShare}
                      className={`flex-1 bg-romantic-500 hover:bg-romantic-600 text-white ${
                        !pageData.isPago ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                    <Button
                      onClick={handlePrint}
                      className={`flex-1 bg-romantic-500 hover:bg-romantic-600 text-white ${
                        !pageData.isPago ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status do Pagamento */}
              {!pageData.isPago && (
                <div className="bg-romantic-50 rounded-lg p-6">
                  <div className="text-center">
                    <p className="text-romantic-700 mb-4">
                      Sua página está pronta! Para liberar o QR Code, link e
                      impressão, finalize o pagamento.
                    </p>
                    <Button
                      onClick={handlePayment}
                      className="bg-romantic-500 hover:bg-romantic-600 text-white"
                    >
                      Finalizar Pagamento
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
