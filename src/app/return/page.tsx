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

        console.log('=== Return Page ===');
        console.log('1. Processing payment with:', {
          sessionId,
          tempSlug,
        });

        if (!sessionId || !tempSlug) {
          console.error('2. Missing required params:', { sessionId, tempSlug });
          setError('Dados da sessão não encontrados');
          return;
        }

        // Buscar dados temporários
        const tempDataResponse = await fetch(`/api/temp-data?key=${tempSlug}`);
        console.log('3. TempData fetch response:', {
          ok: tempDataResponse.ok,
          status: tempDataResponse.status,
        });

        if (!tempDataResponse.ok) {
          throw new Error('Dados temporários não encontrados');
        }

        const { data: tempData } = await tempDataResponse.json();
        console.log('4. TempData retrieved:', {
          hasData: !!tempData,
          plano: tempData?.plano,
        });

        // Processar o pagamento
        const response = await fetch('/api/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tempSlug,
            sessionId,
            tempData,
          }),
        });

        console.log('5. Process payment response:', {
          ok: response.ok,
          status: response.status,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao processar o pagamento');
        }

        const data = await response.json();

        // Limpar dados temporários
        localStorage.removeItem('tempPageData');

        setIsSuccess(true);

        // Redirecionar para a página de sucesso após 3 segundos
        setTimeout(() => {
          router.push(`/success?slug=${data.slug}`);
        }, 3000);
      } catch (error) {
        console.error('Error:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao processar o pagamento'
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
