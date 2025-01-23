'use client';

import LottieAnimation from '@/components/LottieAnimation';
import emailAnimation from '../../public/email-file.json';

export function Footer() {
  return (
    <footer className="bg-romantic-800 text-romantic-100 py-12 -mx-8">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">O Nosso Pra Sempre</h3>
            <p className="text-romantic-200 max-w-md">
              Eternize sua história de amor com uma página única e especial.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-medium">Contato</h4>
            <p className="flex items-center gap-2">
              <div className="w-8 h-8">
                <LottieAnimation
                  animationData={emailAnimation}
                  className="w-full h-full text-romantic-100"
                />
              </div>
              <a
                href="mailto:contato@onossoprasempre.com.br"
                className="hover:text-romantic-300 transition-colors"
              >
                contato@onossoprasempre.com.br
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-romantic-700 mt-8 pt-8 text-center text-romantic-300">
          <p>
            &copy; {new Date().getFullYear()} O Nosso Pra Sempre. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
