'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LottieAnimation } from '@/components/LottieAnimation';
import heartAnimation from '../../public/heart.json';
import walletAnimation from '../../public/wallet.json';
import shareAnimation from '../../public/share.json';

export function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto mt-24 mb-32">
      <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-16">
        Como Funciona
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
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
              sua história de amor
            </CardDescription>
          </CardHeader>
        </Card>

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
      </div>
    </section>
  );
}
