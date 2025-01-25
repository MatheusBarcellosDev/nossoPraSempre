import { TemplateModerno } from './moderno';
import { TemplateRomantico } from './romantico';
import { TemplateMinimalista } from './minimalista';
import { YouTubePlayer } from '@/components/ui/youtube-player';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TemplateType = 'romantico' | 'moderno' | 'minimalista';

export interface TemplateProps {
  nome1: string;
  nome2: string;
  data: string;
  mensagem: string;
  fotos: string[];
  musica?: string;
}

export const templates: Record<
  TemplateType,
  React.ComponentType<TemplateProps>
> = {
  romantico: TemplateRomantico,
  moderno: TemplateModerno,
  minimalista: TemplateMinimalista,
};

// Componente base para todos os templates
export function BaseTemplate({
  children,
  musica,
  variant = 'light',
  className,
}: {
  children: React.ReactNode;
  musica?: string;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div className={cn('relative min-h-screen bg-white', className)}>
      {children}

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
