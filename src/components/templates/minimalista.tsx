import { Heart } from 'lucide-react';
import { TemplateProps } from '.';
import { LoveCounter } from '@/components/ui/love-counter';
import { BaseTemplate } from '.';
import { calcularBodas, proximaBoda } from '@/lib/bodas';
import ReactModal from 'react-modal';
import { useState } from 'react';

export function TemplateMinimalista({
  nome1,
  nome2,
  data,
  mensagem,
  fotos,
  musica,
  signosComponent,
  curiosidadesComponent,
}: TemplateProps & {
  signosComponent?: React.ReactNode;
  curiosidadesComponent?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bodaAtual = data ? calcularBodas(new Date(data)) : null;
  const proximaBodas = data ? proximaBoda(new Date(data)) : null;

  const openModal = (foto: string) => {
    setSelectedImage(foto);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <BaseTemplate
      musica={musica}
      signosComponent={signosComponent}
      curiosidadesComponent={curiosidadesComponent}
    >
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="py-32 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wide">
              <span className="text-gray-800">{nome1}</span>
              <span className="inline-block mx-4 md:mx-6">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-200 inline-block" />
              </span>
              <span className="text-gray-800">{nome2}</span>
            </h1>
            <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <LoveCounter startDate={data} className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="max-w-6xl mx-auto px-4 space-y-32 pb-32">
          {/* Mensagem */}
          <div className="max-w-3xl mx-auto">
            <div className="relative py-16 px-8 sm:px-16">
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <p className="text-gray-600 text-xl sm:text-2xl text-center font-light leading-relaxed whitespace-pre-line">
                {mensagem}
              </p>
            </div>
          </div>

          {/* Galeria */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {fotos.map((foto, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
                  onClick={() => openModal(foto)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto}
                    alt={`Momento ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Modal para exibir a imagem */}
          <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Imagem Ampliada"
            className="fixed inset-0 flex items-center justify-center bg-black/75"
            overlayClassName="fixed inset-0 bg-black/50"
          >
            <div className="relative max-w-3xl max-h-[80vh] w-full h-full flex items-center justify-center">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-2xl"
              >
                &times;
              </button>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Imagem Ampliada"
                  className="max-w-full max-h-full"
                />
              )}
            </div>
          </ReactModal>
        </main>

        {/* Footer */}
        <footer className="py-16 text-center">
          <div className="flex items-center justify-center gap-6">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <Heart className="w-5 h-5 text-gray-200" />
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
        </footer>
      </div>
    </BaseTemplate>
  );
}
