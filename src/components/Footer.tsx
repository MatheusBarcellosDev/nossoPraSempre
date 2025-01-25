'use client';

import LottieAnimation from '@/components/LottieAnimation';
import emailAnimation from '../../public/email-file.json';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-romantic-900 text-white py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
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
            <div className="flex flex-col gap-3 pt-2">
              <a
                href="https://www.instagram.com/o_nossoprasempre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-romantic-200 hover:text-romantic-300 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>@o_nossoprasempre</span>
              </a>
              <a
                href="https://www.tiktok.com/@o.nossoprasempre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-romantic-200 hover:text-romantic-300 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>@o.nossoprasempre</span>
              </a>
              <a
                href="https://www.facebook.com/share/15rHfMXCEa/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-romantic-200 hover:text-romantic-300 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>O Nosso Pra Sempre</span>
              </a>
            </div>
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
