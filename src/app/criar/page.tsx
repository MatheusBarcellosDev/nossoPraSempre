'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { useState, useEffect, Suspense } from 'react';
import { TemplateType, templates } from '@/components/templates';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlan, PlanType, PLANS } from '@/contexts/PlanContext';
import { toast } from 'sonner';
import slugify from 'slugify';
import dynamic from 'next/dynamic';
import heartAnimation from '../../../public/heart.json';
import uploadAnimation from '../../../public/upload.json';
import musicAnimation from '../../../public/music.json';
import brushAnimation from '../../../public/brush.json';
import { SignSelector } from '@/components/SignSelector';
import { getSignMatch } from '@/lib/signos';
import { cn } from '@/lib/utils';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

const SignMatch = dynamic(
  () => import('@/components/SignMatch').then((mod) => mod.SignMatch),
  {
    loading: () => <div>Carregando...</div>,
    ssr: false,
  }
);

function CreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { plan, setPlan } = usePlan();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showSignSelector, setShowSignSelector] = useState(false);

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
    isPrivate: false,
    password: '',
    confirmPassword: '',
    signo1: '',
    signo2: '',
    curiosidades: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (formData.isPrivate && formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [formData.password, formData.confirmPassword, formData.isPrivate]);

  const handleImageUpload = async (urls: string[]) => {
    if (!plan) return;

    try {
      setFormData((prev) => ({
        ...prev,
        fotos: urls,
      }));
    } catch (error) {
      console.error('Erro ao salvar imagens:', error);
      toast.error('Erro ao processar as imagens');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.isPrivate && formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (!plan) {
      toast.error('Por favor, selecione um plano antes de continuar');
      return;
    }

    try {
      setIsSubmitting(true);

      // Validar campos obrigatórios
      if (!formData.nome1 || !formData.nome2 || !formData.data) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      // Validar quantidade de fotos
      if (formData.fotos.length === 0) {
        toast.error('Adicione pelo menos uma foto');
        return;
      }

      if (formData.fotos.length > (plan.type === 'basic' ? 3 : 6)) {
        toast.error(
          `Seu plano permite apenas ${plan.type === 'basic' ? '3' : '6'} fotos`
        );
        return;
      }

      // Gerar slug único
      const baseSlug = slugify(`${formData.nome1}-e-${formData.nome2}`, {
        lower: true,
        strict: true,
      });

      const tempData = {
        ...formData,
        slug: baseSlug,
        plano: plan.type,
        isPago: false,
      };

      const response = await fetch('/api/temp-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: baseSlug,
          data: tempData,
          sessionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar dados');
      }

      router.push(`/criar/finalizar?slug=${baseSlug}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao criar página'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignSelect = (signo1: string, signo2: string) => {
    setFormData((prev) => ({
      ...prev,
      signo1,
      signo2,
    }));
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
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8">
                    <Lottie
                      animationData={heartAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-romantic-800">
                    Informações do Casal
                  </h2>
                </div>

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

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPrivate"
                        className="w-4 h-4 text-romantic-500 border-gray-300 rounded focus:ring-romantic-500"
                        checked={formData.isPrivate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isPrivate: e.target.checked,
                            password: e.target.checked ? prev.password : '',
                          }))
                        }
                      />
                      <Label htmlFor="isPrivate">Tornar página privada</Label>
                    </div>
                    <p className="text-sm text-romantic-600">
                      Por padrão, qualquer pessoa com o link pode acessar sua
                      página. Ative esta opção para proteger sua página com
                      senha e garantir que apenas pessoas autorizadas possam
                      visualizá-la.
                    </p>

                    {formData.isPrivate && (
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <Label htmlFor="password">
                            <div className="flex items-center gap-2">
                              Senha de acesso
                            </div>
                          </Label>
                          <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            placeholder="Digite uma senha para proteger sua página"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            <div className="flex items-center gap-2">
                              Confirmar Senha
                            </div>
                          </Label>
                          <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            placeholder="Digite a senha novamente"
                            className={
                              !passwordMatch
                                ? 'border-red-500 focus:ring-red-500'
                                : ''
                            }
                          />
                          {!passwordMatch && (
                            <p className="text-sm text-red-500">
                              As senhas não coincidem
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="curiosidades"
                        className="w-4 h-4 text-romantic-500 border-gray-300 rounded focus:ring-romantic-500"
                        checked={formData.curiosidades}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            curiosidades: e.target.checked,
                          }))
                        }
                      />
                      <Label htmlFor="curiosidades">
                        Deseja receber curiosidades sobre a data?
                      </Label>
                    </div>
                    <p className="text-sm text-romantic-600">
                      Se ativado, você receberá informações e curiosidades sobre
                      a data que se conheceram após o pagamento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8">
                    <Lottie
                      animationData={uploadAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-romantic-800">
                    Fotos Especiais ({formData.fotos.length}/{plan.maxPhotos})
                  </h2>
                </div>

                <ImageUpload
                  onUpload={handleImageUpload}
                  maxFiles={plan.maxPhotos}
                  value={formData.fotos}
                />
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8">
                    <Lottie
                      animationData={musicAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-romantic-800">
                    Música do Casal
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="musica">Link da Música (YouTube)</Label>
                    <Input
                      id="musica"
                      placeholder="Cole o link do YouTube aqui"
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
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8">
                    <Lottie
                      animationData={brushAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-romantic-800">
                    Escolha o Template
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(templates).map(([key]) => (
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

            {/* Seção de Signos */}
            <Card className="bg-white/80 backdrop-blur overflow-hidden">
              <CardContent className="p-6">
                <button
                  onClick={() => setShowSignSelector(!showSignSelector)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-romantic-500" />
                    <div>
                      <h2 className="text-xl font-semibold text-romantic-800">
                        Compatibilidade Astrológica
                      </h2>
                      <p className="text-sm text-romantic-600">
                        {formData.signo1 && formData.signo2
                          ? `${formData.signo1} + ${formData.signo2}`
                          : 'Descubra a compatibilidade do casal nos astros ✨'}
                      </p>
                    </div>
                  </div>
                  {showSignSelector ? (
                    <ChevronUp className="w-5 h-5 text-romantic-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-romantic-500" />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    showSignSelector
                      ? 'max-h-[1000px] opacity-100 mt-6'
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <SignSelector onSelect={handleSignSelect} />
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
                  <div className="w-full h-full overflow-y-auto">
                    <Template
                      {...formData}
                      isPago={false}
                      signosComponent={
                        formData.signo1 && formData.signo2 ? (
                          <SignMatch
                            signo1={formData.signo1}
                            signo2={formData.signo2}
                            mensagem={getSignMatch(
                              formData.signo1,
                              formData.signo2
                            )}
                            isPago={false}
                            variant={formData.template}
                          />
                        ) : null
                      }
                      curiosidadesComponent={
                        formData.curiosidades ? (
                          <Card
                            className={cn(
                              'p-6 space-y-6 mt-2',
                              // Cada variante com seu estilo específico
                              formData.template === 'romantico' &&
                                'bg-romantic-50',
                              formData.template === 'moderno' &&
                                'bg-gray-950/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
                              formData.template === 'minimalista' &&
                                'bg-gray-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-gray-100'
                            )}
                          >
                            <div className="text-center">
                              <h3
                                className={cn(
                                  'text-xl font-semibold mb-2',
                                  formData.template === 'romantico' &&
                                    'text-romantic-800',
                                  formData.template === 'moderno' &&
                                    'text-white',
                                  formData.template === 'minimalista' &&
                                    'text-gray-800'
                                )}
                              >
                                Curiosidades sobre a data que nos conhecemos
                              </h3>
                              <p
                                className={cn(
                                  'text-sm blur-sm',
                                  formData.template === 'romantico' &&
                                    'text-romantic-600',
                                  formData.template === 'moderno' &&
                                    'text-gray-400',
                                  formData.template === 'minimalista' &&
                                    'text-gray-600'
                                )}
                              >
                                Descubra músicas, eventos e momentos marcantes
                                que aconteceram no dia em que suas histórias se
                                cruzaram. Uma viagem no tempo para celebrar o
                                início dessa linda jornada.
                              </p>
                            </div>
                          </Card>
                        ) : null
                      }
                    />
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

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-romantic-200 border-t-romantic-500 rounded-full animate-spin mx-auto" />
            <p className="text-romantic-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <CreateContent />
    </Suspense>
  );
}
