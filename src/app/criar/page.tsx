'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Heart, Music, Upload } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { useState, useEffect } from 'react';
import { TemplateType, templates } from '@/components/templates';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlan, PlanType, PLANS } from '@/contexts/PlanContext';
import { toast } from 'sonner';

export default function CriarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { plan, setPlan } = usePlan();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const planType = searchParams.get('plan') as PlanType;
    if (!planType || !PLANS[planType]) {
      router.push('/');
      return;
    }
    setPlan(PLANS[planType]);
  }, [searchParams, setPlan, router]);

  const [formData, setFormData] = useState({
    nome1: '',
    nome2: '',
    data: '',
    mensagem: '',
    fotos: [] as string[],
    musica: '',
    template: 'romantico' as TemplateType,
  });

  const handleImageUpload = async (urls: string[]) => {
    if (!plan) return;

    if (formData.fotos.length >= plan.maxPhotos) {
      toast.error(
        `O plano ${
          plan.type === 'basic' ? 'Básico' : 'Premium'
        } permite apenas ${plan.maxPhotos} fotos.`
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      fotos: [...prev.fotos, ...urls],
    }));
  };

  const handleSubmit = async () => {
    if (!plan) return;

    console.log('Iniciando submissão do formulário...');
    console.log('Dados do formulário:', formData);
    console.log('Plano selecionado:', plan);

    // Validações básicas
    if (!formData.nome1.trim() || !formData.nome2.trim()) {
      toast.error('Por favor, preencha os nomes do casal.');
      return;
    }
    if (!formData.data) {
      toast.error('Por favor, selecione a data.');
      return;
    }
    if (!formData.mensagem.trim()) {
      toast.error('Por favor, escreva uma mensagem.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Enviando dados para a API...');

      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome1: formData.nome1,
          nome2: formData.nome2,
          data: formData.data,
          mensagem: formData.mensagem,
          template: formData.template,
          musica: formData.musica,
          fotos: formData.fotos,
          plano: plan.type,
        }),
      });

      console.log('Resposta da API:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
        throw new Error(error.error || 'Erro ao criar a página');
      }

      const data = await response.json();
      console.log('Dados retornados:', data);

      toast.success('Página criada com sucesso!');

      // Redireciona para a página de finalização com o slug
      router.push(`/criar/finalizar?slug=${data.slug}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao criar a página. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Template = templates[formData.template];

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-50 via-romantic-100 to-romantic-50 p-4">
      {!plan ? (
        <div className="flex items-center justify-center h-screen">
          <p>Carregando...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
          {/* Formulário */}
          <div className="space-y-8">
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-romantic-800 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-romantic-500" />
                  Informações do Casal
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome1">Seu Nome</Label>
                    <Input
                      id="nome1"
                      placeholder="Digite seu nome"
                      value={formData.nome1}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nome1: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome2">Nome do seu Amor</Label>
                    <Input
                      id="nome2"
                      placeholder="Digite o nome do seu amor"
                      value={formData.nome2}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nome2: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-romantic-500" />
                        Data que se conheceram
                      </div>
                    </Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          data: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Sua Mensagem de Amor</Label>
                    <Textarea
                      id="mensagem"
                      placeholder="Escreva uma mensagem especial..."
                      className="min-h-[150px]"
                      value={formData.mensagem}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mensagem: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-romantic-800 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-romantic-500" />
                  Fotos Especiais ({formData.fotos.length}/{plan.maxPhotos})
                </h2>

                <ImageUpload
                  onUpload={handleImageUpload}
                  maxFiles={plan.maxPhotos - formData.fotos.length}
                  disabled={formData.fotos.length >= plan.maxPhotos}
                />
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-romantic-800 flex items-center gap-2">
                  <Music className="w-6 h-6 text-romantic-500" />
                  Música do Casal
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="musica">
                      Link da Música (Spotify/YouTube)
                    </Label>
                    <Input
                      id="musica"
                      placeholder="Cole o link da música aqui"
                      value={formData.musica}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          musica: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seleção de Template */}
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-romantic-800">
                  Escolha o Template
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(templates).map(([key, _]) => (
                    <button
                      key={key}
                      className={`aspect-[3/4] rounded-lg p-4 flex items-center justify-center text-center transition-all ${
                        formData.template === key
                          ? 'bg-romantic-500 text-white shadow-lg scale-[1.02]'
                          : 'bg-romantic-100 text-romantic-700 hover:bg-romantic-200'
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          template: key as TemplateType,
                        }))
                      }
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-romantic-500 hover:bg-romantic-600 text-white py-6 text-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Criando...' : 'Visualizar e Finalizar'}
            </Button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8 space-y-8">
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-romantic-800 mb-6">
                  Preview
                </h2>

                <div className="aspect-[9/16] bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="w-full h-full overflow-auto">
                    <Template {...formData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
