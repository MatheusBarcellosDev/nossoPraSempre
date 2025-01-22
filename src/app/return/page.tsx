'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function ReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const tempSlug = searchParams.get('temp_slug');

        if (!sessionId || !tempSlug) {
          console.error('2. Missing required params:', { sessionId, tempSlug });
          setError('Parâmetros inválidos');
          return;
        }

        // Fetch temp data
        const tempDataResponse = await fetch(`/api/temp-data?key=${tempSlug}`);
        if (!tempDataResponse.ok) {
          const errorData = await tempDataResponse.json();
          throw new Error(
            errorData.error || 'Dados temporários não encontrados'
          );
        }

        const { data: tempData } = await tempDataResponse.json();

        if (!tempData) {
          throw new Error('Dados temporários inválidos');
        }

        // Process payment
        const response = await fetch('/api/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            tempData: {
              ...tempData,
              slug: tempSlug,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao processar pagamento');
        }

        const { slug } = await response.json();
        setIsSuccess(true);

        // Aguarda um pouco antes de redirecionar
        setTimeout(() => {
          router.push(`/${slug}`);
        }, 3000);
      } catch (error) {
        console.error('Error:', error);
        setError(
          error instanceof Error ? error.message : 'Erro ao processar pagamento'
        );
      } finally {
        setIsLoading(false);
      }
    };

    processPayment();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-romantic-800">
            Processando pagamento
          </h1>
          <p className="text-romantic-600">
            Aguarde enquanto finalizamos seu pedido...
          </p>
          <div className="w-16 h-16 border-4 border-romantic-200 border-t-romantic-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-romantic-800">
            Erro no processamento
          </h1>
          <p className="text-romantic-600">{error}</p>
          <Button onClick={() => router.push('/')}>Voltar para o início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-semibold text-romantic-800">
          Pagamento confirmado!
        </h1>
        <p className="text-romantic-600">
          Sua página está sendo criada e você será redirecionado em instantes.
        </p>
        <div className="w-16 h-16 border-4 border-romantic-200 border-t-romantic-500 rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

export default function ReturnPage() {
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
      <ReturnContent />
    </Suspense>
  );
}
