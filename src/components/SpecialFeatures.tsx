'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LottieAnimation from '@/components/LottieAnimation';
import timeAnimation from '../../public/time.json';
import cameraAnimation from '../../public/camera.json';
import musicAnimation from '../../public/music.json';
import { motion } from 'framer-motion';

export function SpecialFeatures() {
  return (
    <section className="bg-gradient-to-br from-romantic-50/80 to-romantic-100/80 py-32 md:py-40 -mx-4 sm:-mx-8 mt-32 md:mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-16">
            Recursos Especiais
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Card className="group bg-white hover:bg-gradient-to-br hover:from-romantic-50 hover:to-romantic-100 shadow-lg hover:shadow-xl transition-all duration-500 border-romantic-100 h-[280px]">
              <CardHeader className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-romantic-100 rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <div className="w-12 h-12">
                    <LottieAnimation
                      animationData={timeAnimation}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-romantic-800">
                  Contador de Amor
                </CardTitle>
                <CardDescription className="text-base text-romantic-600">
                  Veja quanto tempo vocês estão juntos, até o último segundo
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
            <Card className="group bg-white hover:bg-gradient-to-br hover:from-romantic-50 hover:to-romantic-100 shadow-lg hover:shadow-xl transition-all duration-500 border-romantic-100 h-[280px]">
              <CardHeader className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-romantic-100 rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <div className="w-12 h-12">
                    <LottieAnimation
                      animationData={cameraAnimation}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-romantic-800">
                  Galeria de Momentos
                </CardTitle>
                <CardDescription className="text-base text-romantic-600">
                  Compartilhe suas fotos mais especiais em uma linda galeria
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
            <Card className="group bg-white hover:bg-gradient-to-br hover:from-romantic-50 hover:to-romantic-100 shadow-lg hover:shadow-xl transition-all duration-500 border-romantic-100 h-[280px]">
              <CardHeader className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-romantic-100 rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <div className="w-12 h-12">
                    <LottieAnimation
                      animationData={musicAnimation}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-romantic-800">
                  Música do Casal
                </CardTitle>
                <CardDescription className="text-base text-romantic-600">
                  Adicione aquela música que marca a história de vocês
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
