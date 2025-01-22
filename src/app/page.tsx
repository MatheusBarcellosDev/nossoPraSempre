import { Heart, Sparkles, Timer, Mail, ChevronDown } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlansSection } from '@/components/PlansSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 pb-0 pt-8 px-8">
      <HeroSection />

      {/* Como Funciona */}
      <section className="max-w-6xl mx-auto mt-24 mb-32">
        <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-16">
          Como Funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <Card className="group bg-white hover:bg-gradient-to-br hover:from-romantic-50 hover:to-romantic-100 shadow-lg hover:shadow-xl transition-all duration-500 border-romantic-100">
            <CardHeader className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-romantic-100 rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <span className="text-romantic-500 text-3xl font-bold">1</span>
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
                <span className="text-romantic-500 text-3xl font-bold">2</span>
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
                <span className="text-romantic-500 text-3xl font-bold">3</span>
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

      {/* Recursos Especiais */}
      <section className="bg-gradient-to-br from-romantic-50/80 to-romantic-100/80 py-24 -mx-8">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-16">
            Recursos Especiais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group bg-white/80 backdrop-blur hover:bg-white transition-all duration-300 border-romantic-200">
              <CardHeader className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-romantic-100 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <Timer className="w-8 h-8 text-romantic-500" />
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
                  <Heart className="w-8 h-8 text-romantic-500" />
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
                  <Sparkles className="w-8 h-8 text-romantic-500" />
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

      {/* Planos */}
      <PlansSection />

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 mt-24 mb-24">
        <h2 className="text-3xl font-semibold text-romantic-800 text-center mb-12">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-romantic-100">
            <details className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <h3 className="text-lg font-medium text-romantic-800">
                  Como funciona o pagamento?
                </h3>
                <ChevronDown className="w-5 h-5 text-romantic-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-romantic-600">
                O pagamento é processado de forma segura através do sistema
                Stripe, aceitando os principais cartões de crédito nacionais e
                internacionais.
              </div>
            </details>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-romantic-100">
            <details className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <h3 className="text-lg font-medium text-romantic-800">
                  Por quanto tempo minha página fica disponível?
                </h3>
                <ChevronDown className="w-5 h-5 text-romantic-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-romantic-600">
                Depende do plano escolhido. O plano básico oferece 1 ano de
                acesso, enquanto o plano premium garante acesso vitalício à sua
                página especial.
              </div>
            </details>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-romantic-100">
            <details className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <h3 className="text-lg font-medium text-romantic-800">
                  Quais recursos estão inclusos na página?
                </h3>
                <ChevronDown className="w-5 h-5 text-romantic-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-romantic-600">
                Sua página inclui galeria de fotos com carrossel, música
                personalizada, contador de tempo juntos, mensagem especial e
                design responsivo que funciona em qualquer dispositivo.
              </div>
            </details>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-romantic-100">
            <details className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <h3 className="text-lg font-medium text-romantic-800">
                  Como compartilho minha página?
                </h3>
                <ChevronDown className="w-5 h-5 text-romantic-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-romantic-600">
                Você recebe um link exclusivo e um QR Code para compartilhar
                facilmente. Pode enviar por WhatsApp, redes sociais ou imprimir
                o QR Code para eventos especiais.
              </div>
            </details>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-romantic-100">
            <details className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <h3 className="text-lg font-medium text-romantic-800">
                  Todos terão acesso à minha página?
                </h3>
                <ChevronDown className="w-5 h-5 text-romantic-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-romantic-600">
                Você tem total controle sobre quem pode acessar sua página. Por
                padrão, ela é pública e pode ser acessada por qualquer pessoa
                com o link, mas você tem a opção de protegê-la com senha,
                garantindo que apenas pessoas autorizadas possam visualizar seu
                conteúdo.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-romantic-800 text-romantic-100 py-12 -mx-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                O Nosso Pra Sempre
              </h3>
              <p className="text-romantic-200 max-w-md">
                Eternize sua história de amor com uma página única e especial.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-medium">Contato</h4>
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
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
    </main>
  );
}
