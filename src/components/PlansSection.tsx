'use client';

import { Check, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { plans } from '@/contexts/PlanContext';
import Link from 'next/link';

export function PlansSection() {
  return (
    <section id="plans" className="max-w-5xl mx-auto mt-24 mb-16">
      <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-4">
        Escolha o Plano Perfeito para Vocês
      </h2>
      <p className="text-center text-romantic-600 mb-12 max-w-2xl mx-auto">
        <Info className="w-4 h-4 inline-block mr-2 text-romantic-500" />
        Você pode personalizar e visualizar sua página antes de fazer o
        pagamento. Pagamento único, sem mensalidades.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <Link href={{ pathname: '/criar', query: { plan: 'basic' } }}>
          <Card className="bg-white/90 backdrop-blur border-romantic-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-x-0 -top-32 -bottom-32 bg-gradient-to-b from-romantic-100 via-transparent to-romantic-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-8 space-y-6 relative">
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-semibold text-romantic-800">
                  Plano Básico
                </h3>
                <div className="text-4xl font-bold text-romantic-600 flex items-center justify-center gap-2">
                  R$ {plans.basic.price.toFixed(2)}
                </div>
                <p className="text-romantic-500 text-sm">
                  Pagamento único • {plans.basic.duration}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-romantic-700">
                  <Check className="w-5 h-5 text-romantic-500" />
                  <span>Site personalizado</span>
                </div>
                <div className="flex items-center gap-2 text-romantic-700">
                  <Check className="w-5 h-5 text-romantic-500" />
                  <span>{plans.basic.maxPhotos} fotos do casal</span>
                </div>
                <div className="flex items-center gap-2 text-romantic-700">
                  <Check className="w-5 h-5 text-romantic-500" />
                  <span>Link exclusivo</span>
                </div>
                <div className="flex items-center gap-2 text-romantic-700">
                  <Check className="w-5 h-5 text-romantic-500" />
                  <span>QR Code para compartilhar</span>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full py-3 px-4 bg-romantic-100 hover:bg-romantic-200 text-romantic-700 rounded-lg transition-colors">
                  Criar Agora • Pague Depois
                </button>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={{ pathname: '/criar', query: { plan: 'premium' } }}>
          <Card className="bg-gradient-to-br from-romantic-500 to-romantic-600 text-white hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 bg-white/10 p-2 px-3 rounded-bl-lg text-sm font-medium">
              Recomendado
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-semibold">Plano Premium</h3>
                <div className="text-4xl font-bold flex items-center justify-center gap-2">
                  R$ {plans.premium.price.toFixed(2)}
                </div>
                <p className="text-romantic-100 text-sm">
                  Pagamento único • {plans.premium.duration}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Tudo do plano básico</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>{plans.premium.maxPhotos} fotos do casal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Hospedagem vitalícia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Suporte prioritário</span>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full py-3 px-4 bg-white hover:bg-romantic-50 text-romantic-600 rounded-lg transition-colors">
                  Criar Agora • Pague Depois
                </button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
