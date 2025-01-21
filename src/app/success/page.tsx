'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Copy, ExternalLink } from 'lucide-react';
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

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Página não encontrada
          </h1>
          <p className="text-gray-600">
            Não foi possível encontrar os dados da página
          </p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button className="w-full" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
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
