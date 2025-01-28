'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { templates } from '@/components/templates';
import {
  Share2,
  Printer,
  Facebook,
  Twitter,
  Send,
  Linkedin,
  Instagram,
} from 'lucide-react';
import { toast } from 'sonner';
import { PasswordCheck } from '@/components/PasswordCheck';

const QRCodeCanvas = dynamic(
  () => import('qrcode.react').then((mod) => mod.QRCodeCanvas),
  {
    ssr: false,
  }
);

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
  const fullUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/pages${pathname}`);
        if (!response.ok) throw new Error('Página não encontrada');
        const data = await response.json();
        setPageData(data);
        setIsAuthenticated(!data.isPrivate);
        // Scroll para o topo quando a página carregar
        window.scrollTo(0, 0);
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
        onSuccess={() => {
          setIsAuthenticated(true);
          // Garante que a página carregue no topo após autenticação
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        }}
        correctPassword={pageData.password || ''}
      />
    );
  }

  const Template = templates[pageData.template];

  const handleWhatsAppShare = async () => {
    try {
      const text =
        `💑 ${pageData.nome1} & ${pageData.nome2}\n\n` +
        `✨ Queremos compartilhar nossa história de amor com você!\n\n` +
        `💝 Visite nossa página especial:\n${fullUrl}\n\n` +
        `🤍 O Nosso Pra Sempre`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    } catch {
      toast.error('Erro ao compartilhar no WhatsApp');
    }
  };

  const handleInstagramShare = () => {
    try {
      const text = `💑 ${pageData.nome1} & ${pageData.nome2}\n\n✨ Nossa história de amor está online!\n\n${fullUrl}\n\n🤍 O Nosso Pra Sempre`;

      navigator.clipboard.writeText(text);

      // Abre o Instagram feed
      window.location.href = 'instagram://';

      toast.success('Texto copiado! Cole no seu post do Instagram 📸✨');
    } catch {
      toast.error('Erro ao abrir o Instagram');
    }
  };

  const handleFacebookShare = () => {
    try {
      const text =
        `💑 ${pageData.nome1} & ${pageData.nome2}\n\n` +
        `✨ Nossa história de amor está online!\n` +
        `🤍 O Nosso Pra Sempre`;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        fullUrl
      )}&quote=${encodeURIComponent(text)}`;
      window.open(facebookUrl, '_blank');
    } catch {
      toast.error('Erro ao compartilhar no Facebook');
    }
  };

  const handleTwitterShare = () => {
    try {
      const text =
        `💑 ${pageData.nome1} & ${pageData.nome2}\n` +
        `✨ Nossa história de amor está online!\n` +
        `🤍 O Nosso Pra Sempre\n\n`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(fullUrl)}`;
      window.open(twitterUrl, '_blank');
    } catch {
      toast.error('Erro ao compartilhar no Twitter');
    }
  };

  const handleTelegramShare = () => {
    try {
      const text =
        `💑 ${pageData.nome1} & ${pageData.nome2}\n\n` +
        `✨ Nossa história de amor está online!\n\n` +
        `Visite nossa página especial:\n${fullUrl}\n\n` +
        `🤍 O Nosso Pra Sempre`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
        fullUrl
      )}&text=${encodeURIComponent(text)}`;
      window.open(telegramUrl, '_blank');
    } catch {
      toast.error('Erro ao compartilhar no Telegram');
    }
  };

  const handleLinkedInShare = () => {
    try {
      const text =
        `${pageData.nome1} & ${pageData.nome2} - Nossa História de Amor\n` +
        `O Nosso Pra Sempre`;
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        fullUrl
      )}&summary=${encodeURIComponent(text)}`;
      window.open(linkedinUrl, '_blank');
    } catch {
      toast.error('Erro ao compartilhar no LinkedIn');
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
            <p class="couple-names">${pageData.nome1}<span class="heart">♥</span>${pageData.nome2}</p>
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
      {/* Meta tag para prevenir zoom no mobile */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />

      <div className="hidden">
        <div id="qr-code">
          <QRCodeCanvas value={fullUrl} size={200} />
        </div>
      </div>

      {/* Botões de compartilhamento */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 items-end z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg flex gap-1 sm:gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="p-1.5 sm:p-2 bg-romantic-500 text-white rounded-full shadow-sm hover:bg-romantic-600 transition-colors"
            title="Compartilhar no WhatsApp"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleInstagramShare}
            className="p-1.5 sm:p-2 bg-romantic-500 text-white rounded-full shadow-sm hover:bg-romantic-600 transition-colors"
            title="Compartilhar no Instagram"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleFacebookShare}
            className="p-1.5 sm:p-2 bg-romantic-500 text-white rounded-full shadow-sm hover:bg-romantic-600 transition-colors"
            title="Compartilhar no Facebook"
          >
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleTwitterShare}
            className="p-1.5 sm:p-2 bg-romantic-500 text-white rounded-full shadow-sm hover:bg-romantic-600 transition-colors"
            title="Compartilhar no Twitter"
          >
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleTelegramShare}
            className="p-1.5 sm:p-2 bg-romantic-500 text-white rounded-full shadow-sm hover:bg-romantic-600 transition-colors"
            title="Compartilhar no Telegram"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleLinkedInShare}
            className="p-1.5 sm:p-2 bg-romantic-500 text-white rounded-full shadow-sm hover:bg-romantic-600 transition-colors"
            title="Compartilhar no LinkedIn"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="p-1.5 sm:p-2 bg-romantic-500 text-white rounded-full shadow-sm hover:bg-romantic-600 transition-colors"
            title="Imprimir QR Code"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Template */}
      <Template {...pageData} />
    </>
  );
}
