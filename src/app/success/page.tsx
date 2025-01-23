'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Copy, ExternalLink, Printer } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const pageUrl = `${baseUrl}/${slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast.success('Link copiado!');
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const handleShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Veja nossa página especial: ${pageUrl}`
      )}`
    );
  };

  const handleViewPage = () => {
    window.open(pageUrl, '_blank');
  };

  const handlePrintQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - O Nosso Pra Sempre</title>
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
            p {
              color: #666;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>O Nosso Pra Sempre</h1>
            <div class="qr-code">
              <div id="qr"></div>
            </div>
            <p>Escaneie para acessar a página</p>
          </div>
          <script>
            window.onload = function() {
              new QRCode(document.getElementById("qr"), {
                text: "${pageUrl}",
                width: 200,
                height: 200
              });
              
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

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-romantic-200 border-t-romantic-500 rounded-full animate-spin mx-auto" />
          <p className="text-romantic-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Página criada com sucesso! 🎉
            </h1>
            <p className="text-gray-600">
              Compartilhe essa página especial com quem você ama
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white rounded-xl shadow-md">
              <QRCodeSVG value={pageUrl} size={200} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 truncate flex-1">
                {pageUrl}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button className="w-full" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handlePrintQRCode}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir QR Code
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewPage}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver página
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Esta página de compartilhamento ficará disponível por 48 horas.
              Salve o link ou QR code antes que expire!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
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
      <SuccessContent />
    </Suspense>
  );
}
