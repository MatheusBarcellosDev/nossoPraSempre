import { Heart, Sparkles } from 'lucide-react';
import { TemplateProps } from '.';
import { LoveCounter } from '@/components/ui/love-counter';
import { BaseTemplate } from '.';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export function TemplateModerno({
  nome1,
  nome2,
  data,
  mensagem,
  fotos,
  musica,
  signo1,
  signo2,
  signosComponent,
  curiosidadesComponent,
}: TemplateProps & {
  signosComponent?: React.ReactNode;
  curiosidadesComponent?: React.ReactNode;
}) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  return (
    <BaseTemplate
      musica={musica}
      variant="dark"
      signosComponent={signosComponent}
      curiosidadesComponent={curiosidadesComponent}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-romantic-950 to-gray-950 text-white p-4 overflow-auto">
        {/* Elementos decorativos */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-romantic-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-romantic-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto space-y-24 py-12 relative">
          {/* Header */}
          <header className="text-center space-y-12">
            <div className="relative inline-block">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <Sparkles className="w-6 h-6 text-romantic-400/80" />
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-widest px-4">
                <span className="bg-gradient-to-r from-romantic-200 to-romantic-300 text-transparent bg-clip-text">
                  {nome1}
                </span>
                <span className="inline-block mx-4 sm:mx-6 opacity-50">&</span>
                <span className="bg-gradient-to-r from-romantic-300 to-romantic-200 text-transparent bg-clip-text">
                  {nome2}
                </span>
              </h1>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 mx-4">
              <LoveCounter startDate={data} className="text-romantic-200" />
            </div>
          </header>

          {/* Galeria Principal com Carrossel */}
          {fotos.length > 0 && (
            <div className="px-4">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {fotos.length === 1 ? (
                  // Quando tiver apenas uma foto
                  <div className="relative">
                    <div className="flex items-center justify-center bg-gray-900/5 min-h-[300px] md:min-h-[500px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fotos[0]}
                        alt="Momento especial"
                        className="w-full h-full object-contain max-h-[70vh]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50" />
                    </div>
                  </div>
                ) : (
                  // Quando tiver mais de uma foto
                  <Slider {...sliderSettings}>
                    {fotos.map((foto, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-center justify-center bg-gray-900/5 min-h-[300px] md:min-h-[500px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={foto}
                            alt={`Momento ${index + 1}`}
                            className="w-full h-full object-contain max-h-[70vh]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50" />
                        </div>
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>
          )}

          {/* Grid de miniaturas */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4">
              {fotos.map((foto, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-romantic-950 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-700" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto}
                    alt={`Momento ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <Heart className="w-8 h-8 text-romantic-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mensagem */}
          <div className="relative max-w-3xl mx-auto px-4">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-romantic-400/30" />
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-romantic-500/10 to-romantic-400/5 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl border border-white/10">
                <p className="text-romantic-100 text-lg sm:text-xl md:text-2xl leading-relaxed whitespace-pre-wrap text-center font-extralight">
                  {mensagem}
                </p>
              </div>
            </div>
          </div>

          {/* Footer decorativo */}
          <footer className="text-center pt-12">
            <div className="flex items-center justify-center gap-6 text-romantic-500/30">
              <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-romantic-500/20 to-transparent" />
              <Sparkles className="w-5 h-5" />
              <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-romantic-500/20 to-transparent" />
            </div>
          </footer>
        </div>
      </div>
    </BaseTemplate>
  );
}
