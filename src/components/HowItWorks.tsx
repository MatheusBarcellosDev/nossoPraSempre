'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LottieAnimation from '@/components/LottieAnimation';
import heartAnimation from '../../public/heart.json';
import walletAnimation from '../../public/wallet.json';
import shareAnimation from '../../public/share.json';
import { motion } from 'framer-motion';

export function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto mt-40 mb-28 md:mt-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-16">
          Como Funciona
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card className="group bg-white hover:bg-gradient-to-br hover:from-romantic-50 hover:to-romantic-100 shadow-lg hover:shadow-xl transition-all duration-500 border-romantic-100">
            <CardHeader className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-romantic-100 rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <div className="w-12 h-12">
                  <LottieAnimation
                    animationData={heartAnimation}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold text-romantic-800">
                Personalize
              </CardTitle>
              <CardDescription className="text-base text-romantic-600">
                Adicione suas fotos favoritas, escolha a música do casal e conte
                sua história
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="group bg-white hover:bg-gradient-to-br hover:from-romantic-50 hover:to-romantic-100 shadow-lg hover:shadow-xl transition-all duration-500 border-romantic-100">
            <CardHeader className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-romantic-100 rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <div className="w-12 h-12">
                  <LottieAnimation
                    animationData={walletAnimation}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold text-romantic-800">
                Escolha seu Plano
              </CardTitle>
              <CardDescription className="text-base text-romantic-600">
                Selecione o plano que melhor atende suas necessidades
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="group bg-white hover:bg-gradient-to-br hover:from-romantic-50 hover:to-romantic-100 shadow-lg hover:shadow-xl transition-all duration-500 border-romantic-100">
            <CardHeader className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-romantic-100 rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <div className="w-12 h-12">
                  <LottieAnimation
                    animationData={shareAnimation}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold text-romantic-800">
                Compartilhe
              </CardTitle>
              <CardDescription className="text-base text-romantic-600">
                Receba seu QR Code exclusivo e compartilhe com quem você ama
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
