'use client';

import LottieAnimation from '@/components/LottieAnimation';
import downArrowAnimation from '../../public/down-arrow.json';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-romantic-800 mb-6">
          Presenteie seu Amor com uma Página Inesquecível
        </h1>
        <p className="text-lg md:text-xl text-romantic-600 mb-8">
          Crie uma página única e especial para celebrar seu amor, compartilhar
          momentos e guardar memórias para sempre.
        </p>

        <Link
          href={{ pathname: '/criar', query: { plan: 'premium' } }}
          className="inline-flex items-center gap-2 bg-romantic-500 hover:bg-romantic-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:gap-4 hover:px-10 group"
        >
          Criar Minha Página Agora
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="text-romantic-500 text-sm">
          Crie sem compromisso • Pague apenas se gostar
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 w-16 h-16"
      >
        <LottieAnimation
          animationData={downArrowAnimation}
          className="w-full h-full"
        />
      </motion.div>
    </section>
  );
}
