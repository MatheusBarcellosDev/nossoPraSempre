import { TemplateType } from '@/components/templates';

export interface PageData {
  id: string;
  nome1: string;
  nome2: string;
  data: string;
  mensagem: string;
  template: TemplateType;
  musica: string;
  fotos: string[];
  slug: string;
  isPago: boolean;
  createdAt: string;
  signo1?: string;
  signo2?: string;
  curiosidadesData?: {
    musicas: string[];
    eventos: string[];
    curiosidades: string[];
  };
}
