'use client';

import dynamic from 'next/dynamic';
import { Card } from './ui/card';
import { Heart } from 'lucide-react';
import { cn } from '../lib/utils';

// Importando as animações dos signos
import ariesAnimation from '../../public/signos/aries.json';
import touroAnimation from '../..//public/signos/taurus.json';
import gemeosAnimation from '../..//public/signos/gemini.json';
import cancerAnimation from '../..//public/signos/cancer.json';
import leaoAnimation from '../..//public/signos/leo.json';
import virgemAnimation from '../..//public/signos/virgo.json';
import libraAnimation from '../..//public/signos/libra.json';
import escorpiaoAnimation from '../..//public/signos/scorpio.json';
import sagitarioAnimation from '../..//public/signos/sagittarius.json';
import capricornioAnimation from '../..//public/signos/capricorn.json';
import aquarioAnimation from '../..//public/signos/aquarius.json';
import peixesAnimation from '../..//public/signos/pisces.json';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

const signos = {
  Áries: ariesAnimation,
  Touro: touroAnimation,
  Gêmeos: gemeosAnimation,
  Câncer: cancerAnimation,
  Leão: leaoAnimation,
  Virgem: virgemAnimation,
  Libra: libraAnimation,
  Escorpião: escorpiaoAnimation,
  Sagitário: sagitarioAnimation,
  Capricórnio: capricornioAnimation,
  Aquário: aquarioAnimation,
  Peixes: peixesAnimation,
};

interface SignMatchProps {
  signo1: string;
  signo2: string;
  mensagem: string;
  isPago?: boolean;
  variant?: 'romantico' | 'moderno' | 'minimalista';
}

export function SignMatch({
  signo1,
  signo2,
  mensagem,
  isPago = false,
  variant = 'romantico',
}: SignMatchProps) {
  return (
    <Card
      className={cn(
        'p-6 space-y-6',
        // Cada variante com seu estilo específico
        variant === 'romantico' && 'bg-romantic-50',
        variant === 'moderno' &&
          'bg-gray-950/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        variant === 'minimalista' &&
          'bg-gray-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-gray-100'
      )}
    >
      <div className="text-center">
        <h3
          className={cn(
            'text-xl font-semibold mb-2',
            variant === 'romantico' && 'text-romantic-800',
            variant === 'moderno' && 'text-white',
            variant === 'minimalista' && 'text-gray-800'
          )}
        >
          Compatibilidade Astrológica
        </h3>
        <p
          className={cn(
            'text-sm',
            variant === 'romantico' && 'text-romantic-600',
            variant === 'moderno' && 'text-gray-400',
            variant === 'minimalista' && 'text-gray-600'
          )}
        >
          Descubra o que os astros dizem sobre o seu amor
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="w-24 h-24">
          <Lottie
            animationData={signos[signo1 as keyof typeof signos]}
            loop={true}
          />
        </div>
        <div className="flex flex-col items-center">
          <Heart
            className={cn(
              'w-6 h-6 mb-1',
              variant === 'romantico' && 'text-romantic-500',
              variant === 'moderno' && 'text-romantic-500',
              variant === 'minimalista' && 'text-gray-400'
            )}
          />
          <div
            className={cn(
              'w-px h-12',
              variant === 'romantico' && 'bg-romantic-200',
              variant === 'moderno' && 'bg-romantic-500/30',
              variant === 'minimalista' && 'bg-gray-200'
            )}
          />
        </div>
        <div className="w-24 h-24">
          <Lottie
            animationData={signos[signo2 as keyof typeof signos]}
            loop={true}
          />
        </div>
      </div>

      <div className="text-center">
        <p
          className={cn(
            'font-medium mb-2',
            variant === 'romantico' && 'text-romantic-700',
            variant === 'moderno' && 'text-white',
            variant === 'minimalista' && 'text-gray-700'
          )}
        >
          {signo1} + {signo2}
        </p>
        <div className={!isPago ? 'blur-[4px]' : ''}>
          <p
            className={cn(
              'text-sm leading-relaxed',
              !isPago && 'select-none',
              variant === 'romantico' && 'text-romantic-600',
              variant === 'moderno' && 'text-gray-300',
              variant === 'minimalista' && 'text-gray-600'
            )}
          >
            {mensagem}
          </p>
        </div>
      </div>
    </Card>
  );
}
