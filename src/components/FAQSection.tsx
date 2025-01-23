'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <section className="py-24 md:py-32 mt-16 md:mt-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-semibold text-romantic-800">
            Perguntas Frequentes
          </h2>
          <p className="text-romantic-600 mt-4">
            Tire suas dúvidas sobre o O Nosso Pra Sempre
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-white hover:bg-romantic-50 p-6 rounded-lg shadow-sm border border-romantic-200 transition-colors duration-200"
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-left text-lg font-medium text-romantic-800">
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
                      className={`w-5 h-5 text-romantic-500 transition-transform duration-200 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-romantic-600 text-left">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
