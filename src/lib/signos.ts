import combinacoesSignos from '../../combinacoes_signos.json';

export function getSignMatch(signo1: string, signo2: string): string {
  const key = `${signo1} - ${signo2}`;
  return (
    (combinacoesSignos.combinações as Record<string, string>)[key] ||
    'Não foi possível encontrar a compatibilidade entre estes signos.'
  );
}
