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

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      router.push('/');
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/checkout-session?session_id=${sessionId}`
        );
        const data = await response.json();

        if (data.status === 'complete') {
          setIsSuccess(true);
          toast.success('Pagamento realizado com sucesso!');
        }
      } catch {
        toast.error('Erro ao verificar status do pagamento');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-romantic-200 border-t-romantic-500 rounded-full animate-spin mx-auto" />
          <p className="text-romantic-600">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        {isSuccess ? (
          <>
            <h1 className="text-2xl font-semibold text-romantic-800">
              Pagamento confirmado!
            </h1>
            <p className="text-romantic-600">
              Sua página está pronta para ser compartilhada.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-romantic-800">
              Aguardando confirmação
            </h1>
            <p className="text-romantic-600">
              O pagamento está sendo processado.
            </p>
          </>
        )}
        <Button onClick={() => router.back()}>Voltar para minha página</Button>
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
