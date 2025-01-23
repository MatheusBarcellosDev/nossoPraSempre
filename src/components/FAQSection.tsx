'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import LottieAnimation from '@/components/LottieAnimation';
import qrCodeAnimation from '../../public/qr-code.json';
import padlockAnimation from '../../public/padlock.json';

interface FAQItem {
  question: string;
  answer: string;
  icon?: any;
}

const faqItems: FAQItem[] = [
  {
    question: 'Como funciona o pagamento?',
    answer:
      'O pagamento é processado de forma segura através do sistema Stripe, aceitando os principais cartões de crédito nacionais e internacionais.',
  },
  {
    question: 'Por quanto tempo minha página fica disponível?',
    answer:
      'Depende do plano escolhido. O plano básico oferece 1 ano de acesso, enquanto o plano premium garante acesso vitalício à sua página especial.',
  },
  {
    question: 'Quais recursos estão inclusos na página?',
    answer:
      'Sua página inclui galeria de fotos com carrossel, música personalizada, contador de tempo juntos, mensagem especial e design responsivo que funciona em qualquer dispositivo.',
  },
  {
    question: 'Como compartilho minha página?',
    answer:
      'Você recebe um link exclusivo e um QR Code para compartilhar facilmente. Pode enviar por WhatsApp, redes sociais ou imprimir o QR Code para eventos especiais.',
    icon: qrCodeAnimation,
  },
  {
    question: 'Todos terão acesso à minha página?',
    answer:
      'Você tem total controle sobre quem pode acessar sua página. Por padrão, ela é pública e pode ser acessada por qualquer pessoa com o link, mas você tem a opção de protegê-la com senha, garantindo que apenas pessoas autorizadas possam visualizar seu conteúdo.',
    icon: padlockAnimation,
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-4 mt-24 mb-24">
      <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-12">
        Perguntas Frequentes
      </h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-romantic-100"
          >
            <div className="p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-medium text-romantic-800">
                  {item.question}
                </h3>
                {item.icon ? (
                  <div className="w-8 h-8">
                    <LottieAnimation
                      animationData={item.icon}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <ChevronDown
                    className={`w-5 h-5 text-romantic-500 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              <div
                className={`mt-4 text-romantic-600 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0 mt-0'
                }`}
              >
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
