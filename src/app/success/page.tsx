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

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - O Nosso Pra Sempre</title>
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
            .print-button {
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #E11D48;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            }
            .print-button:hover {
              background-color: #BE123C;
            }
            @media print {
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>Nossa página no O Nosso Pra Sempre</h1>
          <div id="qr-canvas"></div>
          <p style="font-size: 20px; color: #1f2937; margin-top: 16px; margin-bottom: 8px;">O Nosso Pra Sempre</p>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">www.onossoprasempre.com.br</p>
          <p>Escaneie para acessar a página</p>
          <button class="print-button" onclick="handlePrint()">Imprimir QR Code</button>
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
