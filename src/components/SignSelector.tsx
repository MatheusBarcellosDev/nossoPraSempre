'use client';

import { useState } from 'react';
import Lottie from 'lottie-react';
import { Card } from './ui/card';

// Importando as animações dos signos
import ariesAnimation from '../../public/signos/aries.json';
import touroAnimation from '../../public/signos/taurus.json';
import gemeosAnimation from '../../public/signos/gemini.json';
import cancerAnimation from '../../public/signos/cancer.json';
import leaoAnimation from '../../public/signos/leo.json';
import virgemAnimation from '../../public/signos/virgo.json';
import libraAnimation from '../../public/signos/libra.json';
import escorpiaoAnimation from '../../public/signos/scorpio.json';
import sagitarioAnimation from '../../public/signos/sagittarius.json';
import capricornioAnimation from '../../public/signos/capricorn.json';
import aquarioAnimation from '../../public/signos/aquarius.json';
import peixesAnimation from '../../public/signos/pisces.json';

const signos = [
  { nome: 'Áries', animation: ariesAnimation },
  { nome: 'Touro', animation: touroAnimation },
  { nome: 'Gêmeos', animation: gemeosAnimation },
  { nome: 'Câncer', animation: cancerAnimation },
  { nome: 'Leão', animation: leaoAnimation },
  { nome: 'Virgem', animation: virgemAnimation },
  { nome: 'Libra', animation: libraAnimation },
  { nome: 'Escorpião', animation: escorpiaoAnimation },
  { nome: 'Sagitário', animation: sagitarioAnimation },
  { nome: 'Capricórnio', animation: capricornioAnimation },
  { nome: 'Aquário', animation: aquarioAnimation },
  { nome: 'Peixes', animation: peixesAnimation },
];

interface SignSelectorProps {
  onSelect: (signo1: string, signo2: string) => void;
}

export function SignSelector({ onSelect }: SignSelectorProps) {
  const [signo1, setSigno1] = useState<string | null>(null);
  const [signo2, setSigno2] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handleSignoSelect = (signo: string) => {
    if (step === 1) {
      setSigno1(signo);
      setStep(2);
    } else {
      setSigno2(signo);
      onSelect(signo1!, signo);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-romantic-800">
          {step === 1 ? 'Qual o seu signo?' : 'E o signo do seu amor?'}
        </h3>
        <p className="text-romantic-600">
          {step === 1
            ? 'Selecione o seu signo para descobrir a compatibilidade'
            : 'Agora selecione o signo do seu amor para ver a combinação'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {signos.map((signo) => {
          const isSelected = signo.nome === signo1 || signo.nome === signo2;

          return (
            <Card
              key={signo.nome}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                isSelected
                  ? 'ring-2 ring-romantic-500 bg-romantic-50'
                  : 'hover:bg-romantic-50'
              }`}
              onClick={() => handleSignoSelect(signo.nome)}
            >
              <div className="aspect-square w-full relative">
                <Lottie
                  animationData={signo.animation}
                  loop={true}
                  className="w-full h-full"
                />
              </div>
              <p className="text-center mt-2 font-medium text-romantic-700">
                {signo.nome}
              </p>
            </Card>
          );
        })}
      </div>

      {step === 2 && signo1 && (
        <button
          onClick={() => {
            setSigno1(null);
            setSigno2(null);
            setStep(1);
          }}
          className="mx-auto block text-romantic-600 hover:text-romantic-700"
        >
          Voltar e escolher outro signo
        </button>
      )}
    </div>
  );
}
