'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LottieAnimation } from '@/components/LottieAnimation';
import timeAnimation from '../../public/time.json';
import cameraAnimation from '../../public/camera.json';
import musicAnimation from '../../public/music.json';

export function SpecialFeatures() {
  return (
    <section className="bg-gradient-to-br from-romantic-50/80 to-romantic-100/80 py-24 -mx-8">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-16">
          Recursos Especiais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="group bg-white/80 backdrop-blur hover:bg-white transition-all duration-300 border-romantic-200">
            <CardHeader className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-romantic-100 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                <div className="w-12 h-12">
                  <LottieAnimation
                    animationData={timeAnimation}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-romantic-700 mb-3">
                Contador de Amor
              </CardTitle>
              <CardDescription className="text-romantic-600">
                Veja quanto tempo vocês estão juntos, até o último segundo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group bg-white/80 backdrop-blur hover:bg-white transition-all duration-300 border-romantic-200">
            <CardHeader className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-romantic-100 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                <div className="w-12 h-12">
                  <LottieAnimation
                    animationData={cameraAnimation}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-romantic-700 mb-3">
                Galeria de Momentos
              </CardTitle>
              <CardDescription className="text-romantic-600">
                Compartilhe suas fotos mais especiais em uma linda galeria
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group bg-white/80 backdrop-blur hover:bg-white transition-all duration-300 border-romantic-200">
            <CardHeader className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-romantic-100 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                <div className="w-12 h-12">
                  <LottieAnimation
                    animationData={musicAnimation}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-romantic-700 mb-3">
                Música do Casal
              </CardTitle>
              <CardDescription className="text-romantic-600">
                Adicione aquela música que marca a história de vocês
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
