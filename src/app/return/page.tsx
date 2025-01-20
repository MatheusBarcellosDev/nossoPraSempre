'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function ReturnPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      toast.error('Sessão de pagamento não encontrada');
      router.push('/');
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payment?session_id=${sessionId}`);
        const data = await response.json();

        if (data.isPago) {
          setStatus('complete');
          setCustomerEmail(data.customer_email);
          setSlug(data.slug);
          toast.success('Pagamento confirmado com sucesso!');
        } else {
          toast.error('Pagamento não confirmado');
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
        toast.error('Erro ao verificar pagamento');
        router.push('/');
      }
    };

    checkPaymentStatus();
  }, [sessionId, router]);

  if (status === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-romantic-50 via-romantic-100 to-romantic-50 p-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-semibold text-romantic-800">
            Pagamento Concluído!
          </h1>
          <p className="text-romantic-600">
            Obrigado por sua compra! Um e-mail de confirmação foi enviado para{' '}
            {customerEmail}.
          </p>
          <p className="text-romantic-600">
            Agora você pode compartilhar sua página com quem quiser!
          </p>
          <Button
            onClick={() => router.push(`/criar/finalizar?slug=${slug}`)}
            className="w-full bg-romantic-500 hover:bg-romantic-600 text-white"
          >
            Voltar para minha página
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-50 via-romantic-100 to-romantic-50 p-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-romantic-800">
          Processando seu pagamento...
        </h1>
      </div>
    </div>
  );
}
