'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, ChevronDown } from 'lucide-react';
import { templates, TemplateType } from '@/components/templates';
import { SignMatch } from '@/components/SignMatch';
import { getSignMatch } from '@/lib/signos';
import { cn } from '@/lib/utils';

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
  signo1?: string;
  signo2?: string;
  curiosidades?: string;
}

interface CuriosidadesData {
  musicas: string[];
  eventos: string[];
  curiosidades: string[];
}

function FinalizarContent() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutos em segundos
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [testCuriosidades, setTestCuriosidades] =
    useState<CuriosidadesData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
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
                  <Template
                    {...pageData}
                    signosComponent={
                      pageData.signo1 && pageData.signo2 ? (
                        <SignMatch
                          signo1={pageData.signo1}
                          signo2={pageData.signo2}
                          mensagem={getSignMatch(
                            pageData.signo1,
                            pageData.signo2
                          )}
                          isPago={pageData.isPago}
                          variant={pageData.template}
                        />
                      ) : null
                    }
                    curiosidadesComponent={
                      pageData.curiosidades ? (
                        <Card
                          className={cn(
                            'p-6 mt-2',
                            // Cada variante com seu estilo específico
                            pageData.template === 'romantico' &&
                              'bg-romantic-50',
                            pageData.template === 'moderno' &&
                              'bg-gray-950/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
                            pageData.template === 'minimalista' &&
                              'bg-gray-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-gray-100'
                          )}
                        >
                          <div>
                            <button
                              onClick={() => setIsExpanded(!isExpanded)}
                              className="w-full flex items-center justify-between"
                            >
                              <h3
                                className={cn(
                                  'text-xl font-semibold',
                                  pageData.template === 'romantico' &&
                                    'text-romantic-800',
                                  pageData.template === 'moderno' &&
                                    'text-white',
                                  pageData.template === 'minimalista' &&
                                    'text-gray-800'
                                )}
                              >
                                Curiosidades sobre a data que nos conhecemos
                              </h3>
                              <ChevronDown
                                className={cn(
                                  'w-5 h-5 transition-transform duration-200',
                                  isExpanded && 'transform rotate-180',
                                  pageData.template === 'romantico' &&
                                    'text-romantic-800',
                                  pageData.template === 'moderno' &&
                                    'text-white',
                                  pageData.template === 'minimalista' &&
                                    'text-gray-800'
                                )}
                              />
                            </button>
                            <div
                              className={cn(
                                'overflow-hidden transition-all duration-200 text-center',
                                isExpanded ? 'max-h-96 mt-4' : 'max-h-0'
                              )}
                            >
                              <p
                                className={cn(
                                  'text-sm blur-sm',
                                  pageData.template === 'romantico' &&
                                    'text-romantic-600',
                                  pageData.template === 'moderno' &&
                                    'text-gray-400',
                                  pageData.template === 'minimalista' &&
                                    'text-gray-600'
                                )}
                              >
                                Descubra músicas, eventos e momentos marcantes
                                que aconteceram no dia em que suas histórias se
                                cruzaram. Uma viagem no tempo para celebrar o
                                início dessa linda jornada.
                              </p>
                            </div>
                          </div>
                        </Card>
                      ) : null
                    }
                  />
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

            {/* Coluna do Pagamento e Compatibilidade */}
            <div className="lg:col-span-1 space-y-6">
              {/* Card de Pagamento */}
              <Card className="p-6 shadow-lg">
                <div className="text-center space-y-5">
                  <div>
                    <h2 className="text-xl font-semibold text-romantic-800">
                      Finalizar Pagamento
                    </h2>
                    <p className="text-romantic-600 text-sm mt-1">
                      Escolha a forma de pagamento
                    </p>
                  </div>

                  <div className="py-3 px-4 bg-romantic-50 rounded-lg">
                    <div className="flex flex-col items-center">
                      <span className="text-romantic-600 text-sm mb-1">
                        Eternize seus momentos por apenas
                      </span>
                      <p className="text-3xl font-bold text-romantic-800 mb-0.5">
                        R$ {PLANS[pageData.plano].price.toFixed(2)}
                      </p>
                      <p className="text-romantic-500 text-xs">
                        com acesso{' '}
                        {PLANS[pageData.plano].duration === 'vitalício'
                          ? 'vitalício'
                          : `por ${PLANS[pageData.plano].duration}`}
                      </p>
                    </div>
                  </div>

                  {/* Tabs de Pagamento */}
                  <div className="border-b border-romantic-200">
                    <div className="flex space-x-6">
                      <button className="px-4 py-2 text-romantic-800 border-b-2 border-romantic-500 font-medium text-sm">
                        Cartão de Crédito
                      </button>
                      <button className="px-4 py-2 text-romantic-400 cursor-not-allowed text-sm">
                        PIX (em breve)
                      </button>
                    </div>
                  </div>

                  <div>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                      className="w-full py-5 text-base bg-romantic-600 hover:bg-romantic-700"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {isProcessingPayment ? 'Processando...' : 'Continuar'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card de Compatibilidade */}
              {pageData.signo1 && pageData.signo2 && (
                <SignMatch
                  signo1={pageData.signo1}
                  signo2={pageData.signo2}
                  mensagem={getSignMatch(pageData.signo1, pageData.signo2)}
                  isPago={pageData.isPago}
                  variant={pageData.template}
                />
              )}
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
