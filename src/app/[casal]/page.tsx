'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { templates } from '@/components/templates';
import { QRCodeCanvas } from 'qrcode.react';
import { Share2, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface PageData {
  nome1: string;
  nome2: string;
  data: string;
  mensagem: string;
  fotos: string[];
  musica?: string;
  template: 'romantico' | 'moderno' | 'minimalista';
  isPago: boolean;
}

export default function Page() {
  const pathname = usePathname();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = pathname.replace('/', '');
        const response = await fetch(`/api/pages?slug=${slug}`);
        if (!response.ok) throw new Error('Página não encontrada');
        const data = await response.json();
        // Não é mais necessário transformar os dados
        setPageData(data);
      } catch (error) {
        toast.error('Erro ao carregar a página');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!pageData) {
    return <div>Página não encontrada</div>;
  }

  const Template = templates[pageData.template];
  const fullUrl = `${window.location.origin}${pathname}`;

  const handleShare = async () => {
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

  const handlePrint = () => {
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
            window.onload = function() {
              new QRCode(document.getElementById("qr"), {
                text: "${fullUrl}",
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

  return (
    <>
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
