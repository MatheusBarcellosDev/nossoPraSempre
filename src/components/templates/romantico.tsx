import { Heart, Sparkles } from 'lucide-react';
import { TemplateProps } from '.';
import { LoveCounter } from '@/components/ui/love-counter';
import { calcularBodas, proximaBoda } from '@/lib/bodas';
import { BaseTemplate } from '.';
import ReactModal from 'react-modal';
import { useState } from 'react';

export function TemplateRomantico({
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
      <div className="min-h-screen bg-gradient-to-br from-romantic-50 via-white to-romantic-50 p-4 overflow-auto relative">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-romantic-200/30 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-romantic-200/30 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto space-y-16 py-12 relative">
          {/* Header */}
          <header className="text-center space-y-8">
            <div className="relative inline-block">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <Sparkles className="w-6 h-6 text-romantic-400" />
              </div>
              <h1 className="text-5xl md:text-6xl font-light tracking-wider">
                <span className="bg-gradient-to-r from-romantic-600 to-romantic-500 text-transparent bg-clip-text">
                  {nome1}
                </span>
                <span className="inline-block mx-4">
                  <Heart className="w-8 h-8 text-romantic-400 inline-block" />
                </span>
                <span className="bg-gradient-to-r from-romantic-500 to-romantic-600 text-transparent bg-clip-text">
                  {nome2}
                </span>
              </h1>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-romantic-100">
              <LoveCounter startDate={data} className="text-romantic-500" />
            </div>
          </header>

          {/* Galeria */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {fotos.map((foto, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                  onClick={() => openModal(foto)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-romantic-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto}
                    alt={`Momento ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
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

          {/* Mensagem */}
          <div className="relative bg-gradient-to-br from-romantic-50 to-romantic-100 p-8 rounded-3xl shadow-lg mb-16">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-romantic-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-romantic-700 text-lg text-center mt-4 whitespace-pre-line">
              {mensagem}
            </p>
          </div>

          {/* Footer decorativo */}
          <footer className="text-center pt-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-romantic-300 to-transparent" />
              <Sparkles className="w-5 h-5 text-romantic-400" />
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-romantic-300 to-transparent" />
            </div>
          </footer>

          {/* Adiciona a seção de bodas apenas se houver uma data e bodas */}
          {bodaAtual && (
            <div className="max-w-2xl mx-auto mt-12 text-center">
              <div className="bg-romantic-50/50 rounded-2xl p-6 backdrop-blur">
                <h3 className="text-2xl font-semibold text-romantic-800 mb-2">
                  {bodaAtual.nome}
                </h3>
                <p className="text-romantic-600">
                  Celebrando {bodaAtual.anos}{' '}
                  {bodaAtual.anos === 1 ? 'ano' : 'anos'} de amor!
                </p>
                {proximaBodas && (
                  <p className="text-romantic-500 text-sm mt-2">
                    Próxima celebração: {proximaBodas.nome} em{' '}
                    {proximaBodas.anos - bodaAtual.anos}{' '}
                    {proximaBodas.anos - bodaAtual.anos === 1 ? 'ano' : 'anos'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseTemplate>
  );
}
