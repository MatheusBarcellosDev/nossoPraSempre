'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function HomeShowcase() {
  return (
    <section className="py-16 md:py-24  md:mt-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl font-semibold text-romantic-800 mb-6">
            Eternize Sua História de Amor
          </h2>
          <p className="text-romantic-600 text-lg max-w-2xl mx-auto">
            Crie uma página única e especial para celebrar seu amor,
            compartilhar momentos e guardar memórias para sempre.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Primeira imagem */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-[9/16] rounded-2xl overflow-hidden group max-w-sm mx-auto w-full"
          >
            <Image
              src="/home/a-romantic-illustration-of-a-person-hold_vhm-ILEURz2dgEnV2CH48w_s5-ttidCRq25iZybJeiLeg.webp"
              alt="Casal romântico"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 384px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-romantic-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          {/* Segunda imagem */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-[9/16] rounded-2xl overflow-hidden group max-w-sm mx-auto w-full"
          >
            <Image
              src="/home/a-soft-pastel-toned-background-with-floa_xm6XIHTFQ828E0MjJZpKTA_RQpLcs3jRZu3WNq4pxh_OA.webp"
              alt="Fundo romântico"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 384px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-romantic-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-romantic-100/30 rounded-full mix-blend-multiply blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-romantic-200/30 rounded-full mix-blend-multiply blur-3xl" />
        </div>
      </div>
    </section>
  );
}
