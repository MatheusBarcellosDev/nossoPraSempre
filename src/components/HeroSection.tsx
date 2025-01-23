'use client';

import LottieAnimation from '@/components/LottieAnimation';
import downArrowAnimation from '../../public/down-arrow.json';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-romantic-800 mb-6">
          Presenteie seu Amor com uma Página Inesquecível
        </h1>
        <p className="text-lg md:text-xl text-romantic-600 mb-8">
          Crie uma página única e especial para celebrar seu amor, compartilhar
          momentos e guardar memórias para sempre.
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
