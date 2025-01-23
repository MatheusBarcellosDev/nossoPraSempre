'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ExamplePages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const templates = [
    {
      image: '/exemplos/fire01.png',
      title: 'Template Clássico',
      description: 'Design elegante com foco nas suas fotos e história.',
    },
    {
      image: '/exemplos/fire02.png',
      title: 'Template Moderno',
      description: 'Layout contemporâneo com elementos interativos.',
    },
    {
      image: '/exemplos/fire03.png',
      title: 'Template Romântico',
      description: 'Estilo suave com detalhes delicados e animações.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % templates.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 overflow-hidden bg-gradient-to-b from-romantic-50/50 to-romantic-100/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-romantic-800 text-center mb-8">
          Templates Exclusivos
        </h2>
        <p className="text-center text-romantic-600 mb-16 max-w-2xl mx-auto">
          Escolha entre nossos designs cuidadosamente criados para contar sua
          história de amor
        </p>

        <div
          className="relative w-full"
          style={{ height: 'calc(100vh - 400px)' }}
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.image}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0,
                scale: index === currentIndex ? 1 : 0.8,
                zIndex: index === currentIndex ? 10 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full max-w-5xl mx-auto group">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={template.image}
                    alt={template.title}
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-contain"
                    priority={index === 0}
                    quality={100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                      {template.title}
                    </h3>
                    <p className="text-lg opacity-90">{template.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-romantic-500 w-6'
                  : 'bg-romantic-300 hover:bg-romantic-400'
              }`}
              aria-label={`Ver template ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
