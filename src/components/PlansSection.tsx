'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PLAN = {
  type: 'premium',
  maxPhotos: 6,
  duration: 'vitalício',
  price: 24.9,
};

export function PlansSection() {
  return (
    <section id="plans" className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-semibold text-romantic-800">
            Plano Único
          </h2>
          <p className="text-romantic-600 mt-4">
            Tudo que você precisa para eternizar sua história de amor
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-romantic-500">
            <Link href={{ pathname: '/criar', query: { plan: 'premium' } }}>
              <CardContent className="p-8">
                <div className="space-y-2 text-center">
                  <h3 className="text-2xl font-semibold text-white">
                    Plano Premium
                  </h3>
                  <div className="text-4xl font-bold text-white">
                    R$ {PLAN.price.toFixed(2)}
                  </div>
                  <p className="text-romantic-100 text-sm">
                    Pagamento único • {PLAN.duration}
                  </p>
                </div>

                <div className="space-y-3 pt-6">
                  <div className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-romantic-100" />
                    <span>Site personalizado e exclusivo</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-romantic-100" />
                    <span>Até {PLAN.maxPhotos} fotos do casal</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-romantic-100" />
                    <span>Música personalizada</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-romantic-100" />
                    <span>Link exclusivo vitalício</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-romantic-100" />
                    <span>QR Code para compartilhar</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-romantic-100" />
                    <span>Opção de página privada com senha</span>
                  </div>
                </div>

                <div className="pt-8">
                  <button className="w-full py-4 px-4 bg-white hover:bg-romantic-50 text-romantic-500 rounded-lg transition-colors text-lg font-medium">
                    Criar Agora • Pague Depois
                  </button>
                  <p className="text-romantic-100 text-sm text-center mt-4">
                    Crie sua página sem compromisso
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
