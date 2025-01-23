'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToPlans = () => {
    if (isClient) {
      const plansSection = document.querySelector('#plans');
      if (plansSection) {
        plansSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold text-romantic-800 mb-6">
        Presenteie seu Amor com uma Página Inesquecível
      </h1>
      <p className="text-lg md:text-xl text-romantic-600 mb-12 max-w-2xl">
        Crie uma página única e especial para celebrar sua história de amor.
        Personalize com fotos, música e mensagens do seu jeito.
      </p>
      <Button
        onClick={scrollToPlans}
        className="bg-romantic-500 hover:bg-romantic-600 text-white px-8 py-6 text-lg rounded-full group"
      >
        Começar Agora
        <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
      </Button>
    </section>
  );
}
