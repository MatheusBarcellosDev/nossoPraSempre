'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Share2, Copy, ExternalLink, Printer } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Suspense } from 'react';

const QRCodeSVG = dynamic(
  () => import('qrcode.react').then((mod) => mod.QRCodeSVG),
  {
    ssr: false,
  }
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  console.log(slug);
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const pageUrl = `${baseUrl}/${slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast.success('Link copiado!');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Erro ao copiar link');
    }
  };

  const handleShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Oi! Acabei de criar nossa página especial no O Nosso Pra Sempre 💕\n\n` +
          `Criei um espaço único para guardar nossas memórias e momentos especiais 💝\n\n` +
          `Venha conhecer nossa história:\n${pageUrl}`
      )}`
    );
  };

  const handleViewPage = () => {
    window.open(pageUrl, '_blank');
  };

  const handlePrintQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const fullUrl = `${window.location.origin}/${slug}`;

    // Extrair os nomes do slug e capitalizar primeira letra
    const names = slug?.split('-m')[0].split('-e-') || ['', ''];
    const nome1 = names[0]
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());
    const nome2 = names[1]
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${nome1} & ${nome2}</title>
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
              padding: 24px;
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .couple-names {
              font-size: 42px;
              font-weight: 600;
              color: #1f2937;
              text-align: center;
              line-height: 1.2;
              margin-bottom: 4px;
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
              margin-bottom: 16px;
              letter-spacing: 0.05em;
            }
            .website {
              font-size: 12px;
              color: #9CA3AF;
              text-align: center;
              margin-top: 8px;
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
            <p class="couple-names">${nome1}<span class="heart">♥</span>${nome2}</p>
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
    <div className="min-h-screen bg-romantic-50/50">
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-romantic-800 mb-4">
              Página Criada com Sucesso!
            </h1>
            <p className="text-romantic-600">
              Sua página está pronta para ser compartilhada com quem você ama.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Suspense
              fallback={
                <div className="w-[200px] h-[200px] bg-romantic-100 animate-pulse rounded-lg" />
              }
            >
              <QRCodeSVG value={pageUrl} size={200} level="H" />
            </Suspense>
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
