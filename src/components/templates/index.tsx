import { TemplateModerno } from './moderno';
import { TemplateRomantico } from './romantico';
import { TemplateMinimalista } from './minimalista';
import { YouTubePlayer } from '@/components/ui/youtube-player';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  nome1: string;
  nome2: string;
  data: string;
  mensagem: string;
  fotos: string[];
  musica?: string;
  signo1?: string;
  signo2?: string;
  isPago?: boolean;
  curiosidadesComponent?: React.ReactNode;
}

export const templates = {
  romantico: TemplateRomantico,
  moderno: TemplateModerno,
  minimalista: TemplateMinimalista,
} as const;

export type TemplateType = keyof typeof templates;

// Componente base para todos os templates
export function BaseTemplate({
  children,
  musica,
  variant = 'light',
  className,
  signosComponent,
  curiosidadesComponent,
}: {
  children: React.ReactNode;
  musica?: string;
  variant?: 'light' | 'dark';
  className?: string;
  signosComponent?: React.ReactNode;
  curiosidadesComponent?: React.ReactNode;
}) {
  return (
    <div className={cn('relative min-h-screen bg-white', className)}>
      {children}

      {/* Seção de Signos */}
      {signosComponent && (
        <div
          className={`w-full py-16 ${
            variant === 'dark' ? 'bg-gray-950' : 'bg-romantic-50/50'
          }`}
        >
          <div className="max-w-2xl mx-auto px-4">{signosComponent}</div>
        </div>
      )}

      {/* Seção de Curiosidades */}
      {curiosidadesComponent && (
        <div
          className={`w-full py-16 ${
            variant === 'dark' ? 'bg-gray-950' : 'bg-romantic-50/50'
          }`}
        >
          <div className="max-w-2xl mx-auto px-4">{curiosidadesComponent}</div>
        </div>
      )}

      {/* Música do Casal - comum a todos os templates */}
      {musica && (
        <div
          className={`w-full py-16 ${
            variant === 'dark' ? 'bg-gray-950' : 'bg-romantic-50/50'
          }`}
        >
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Music
                className={`w-5 h-5 ${
                  variant === 'dark' ? 'text-romantic-200' : 'text-romantic-500'
                }`}
              />
              <h3
                className={`text-xl font-medium ${
                  variant === 'dark' ? 'text-romantic-200' : 'text-romantic-800'
                }`}
              >
                Nossa Música
              </h3>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <YouTubePlayer url={musica} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
