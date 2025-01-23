'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
    price: 29.9,
  },
};

export function PlansSection() {
  return (
    <section id="plans" className="py-24 md:py-32 mt-16 md:mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-semibold text-romantic-800">
            Escolha seu Plano
          </h2>
          <p className="text-romantic-600 mt-4">
            Selecione o plano ideal para eternizar sua história de amor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <Link href={{ pathname: '/criar', query: { plan: 'basic' } }}>
                <CardContent className="p-8">
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-semibold text-romantic-800">
                      Plano Básico
                    </h3>
                    <div className="text-4xl font-bold text-romantic-600">
                      R$ {PLANS.basic.price.toFixed(2)}
                    </div>
                    <p className="text-romantic-500 text-sm">
                      Pagamento único • {PLANS.basic.duration}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-romantic-700">
                      <Check className="w-5 h-5 text-romantic-500" />
                      <span>Site personalizado</span>
                    </div>
                    <div className="flex items-center gap-2 text-romantic-700">
                      <Check className="w-5 h-5 text-romantic-500" />
                      <span>{PLANS.basic.maxPhotos} fotos do casal</span>
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
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-romantic-500">
              <Link href={{ pathname: '/criar', query: { plan: 'premium' } }}>
                <CardContent className="p-8">
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-semibold text-white">
                      Plano Premium
                    </h3>
                    <div className="text-4xl font-bold text-white">
                      R$ {PLANS.premium.price.toFixed(2)}
                    </div>
                    <p className="text-romantic-100 text-sm">
                      Pagamento único • {PLANS.premium.duration}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-white">
                      <Check className="w-5 h-5 text-romantic-100" />
                      <span>Site personalizado</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Check className="w-5 h-5 text-romantic-100" />
                      <span>{PLANS.premium.maxPhotos} fotos do casal</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Check className="w-5 h-5 text-romantic-100" />
                      <span>Link exclusivo</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Check className="w-5 h-5 text-romantic-100" />
                      <span>QR Code para compartilhar</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button className="w-full py-3 px-4 bg-white hover:bg-romantic-50 text-romantic-500 rounded-lg transition-colors">
                      Criar Agora • Pague Depois
                    </button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
