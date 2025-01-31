'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
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

    (async () => {
      try {
        const response = await fetch(`/api/temp-data?key=${slug}`);
        if (!response.ok) throw new Error('Dados temporários não encontrados');

        const { data } = await response.json();
        setPageData(data);
      } catch {
        toast.error('Erro ao carregar dados temporários');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    })();
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
        throw new Error(error.error || 'Erro ao criar sessão de pagamento');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de pagamento não encontrada');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao processar pagamento'
      );
      setIsProcessingPayment(false);
    }
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
    <div className="min-h-screen bg-romantic-50/50">
      {!pageData?.isPago && (
        <div className="fixed top-0 left-0 right-0 bg-romantic-500 text-white py-1.5 text-center text-sm z-50">
          Tempo para finalizar: {formatTime(timeLeft)}
        </div>
      )}

      <div className="pt-12 pb-4 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-romantic-800">
              Prévia da sua página
            </h1>
            <p className="text-romantic-600 mt-2">
              Confira como ficou sua página antes de finalizar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna da Prévia */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden relative shadow-lg h-full">
                <div className={!pageData.isPago ? 'blur-[2px]' : ''}>
                  <Template {...pageData} />
                </div>

                {!pageData.isPago && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <Card className="w-full max-w-md mx-4 p-4 bg-white/95 backdrop-blur shadow-lg">
                      <p className="text-center text-romantic-800 text-sm">
                        Esta é uma prévia da sua página. Após o pagamento, você
                        terá acesso completo e poderá compartilhá-la.
                      </p>
                    </Card>
                  </div>
                )}
              </Card>
            </div>

            {/* Coluna do Pagamento */}
            <div className="lg:col-span-1">
              <Card className="p-8 shadow-lg">
                <div className="text-center space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-romantic-800">
                      Finalizar Pagamento
                    </h2>
                    <p className="text-romantic-600 mt-1">
                      Escolha a forma de pagamento
                    </p>
                  </div>

                  <div className="py-4 px-6 bg-romantic-50 rounded-lg">
                    <div className="flex flex-col items-center">
                      <span className="text-romantic-600 text-sm font-medium mb-1">
                        Eternize seus momentos por apenas
                      </span>
                      <p className="text-4xl font-bold text-romantic-800 mb-1">
                        R$ {PLANS[pageData.plano].price.toFixed(2)}
                      </p>
                      <p className="text-romantic-500 text-sm">
                        {PLANS[pageData.plano].duration === 'vitalício'
                          ? 'com acesso vitalício'
                          : `com acesso por ${PLANS[pageData.plano].duration}`}
                      </p>
                    </div>
                  </div>

                  {/* Tabs de Pagamento */}
                  <div className="border-b border-romantic-200">
                    <div className="flex space-x-4">
                      <button className="px-4 py-2 text-romantic-800 border-b-2 border-romantic-500 font-medium">
                        Cartão de Crédito
                      </button>
                      <button className="px-4 py-2 text-romantic-400 cursor-not-allowed">
                        PIX (em breve)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                      className="w-full py-6 text-lg bg-romantic-600 hover:bg-romantic-700"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      {isProcessingPayment ? 'Processando...' : 'Continuar'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
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
