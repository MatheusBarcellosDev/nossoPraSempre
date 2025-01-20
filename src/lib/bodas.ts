interface Boda {
  nome: string;
  material: string;
  anos: number;
}

const BODAS: Boda[] = [
  { nome: 'Bodas de Papel', material: 'papel', anos: 1 },
  { nome: 'Bodas de Algodão', material: 'algodão', anos: 2 },
  { nome: 'Bodas de Couro', material: 'couro', anos: 3 },
  { nome: 'Bodas de Flores e Frutas', material: 'flores', anos: 4 },
  { nome: 'Bodas de Madeira', material: 'madeira', anos: 5 },
  { nome: 'Bodas de Açúcar', material: 'açúcar', anos: 6 },
  { nome: 'Bodas de Lã', material: 'lã', anos: 7 },
  { nome: 'Bodas de Bronze', material: 'bronze', anos: 8 },
  { nome: 'Bodas de Cerâmica', material: 'cerâmica', anos: 9 },
  { nome: 'Bodas de Estanho', material: 'estanho', anos: 10 },
  { nome: 'Bodas de Cristal', material: 'cristal', anos: 15 },
  { nome: 'Bodas de Porcelana', material: 'porcelana', anos: 20 },
  { nome: 'Bodas de Prata', material: 'prata', anos: 25 },
  { nome: 'Bodas de Pérola', material: 'pérola', anos: 30 },
  { nome: 'Bodas de Coral', material: 'coral', anos: 35 },
  { nome: 'Bodas de Rubi', material: 'rubi', anos: 40 },
  { nome: 'Bodas de Safira', material: 'safira', anos: 45 },
  { nome: 'Bodas de Ouro', material: 'ouro', anos: 50 },
  { nome: 'Bodas de Diamante', material: 'diamante', anos: 60 },
  { nome: 'Bodas de Platina', material: 'platina', anos: 70 },
];

export function calcularBodas(dataInicio: Date): Boda | null {
  const hoje = new Date();
  const diffTime = Math.abs(hoje.getTime() - dataInicio.getTime());
  const diffAnos = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

  // Encontra a boda mais próxima (atual ou próxima)
  const bodaAtual = [...BODAS].reverse().find((boda) => diffAnos >= boda.anos);

  return bodaAtual || null;
}

export function proximaBoda(dataInicio: Date): Boda | null {
  const hoje = new Date();
  const diffTime = Math.abs(hoje.getTime() - dataInicio.getTime());
  const diffAnos = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

  const proximaBoda = BODAS.find((boda) => boda.anos > diffAnos);

  return proximaBoda || null;
}

export function anosDeRelacionamento(dataInicio: Date): number {
  const hoje = new Date();
  const diffTime = Math.abs(hoje.getTime() - dataInicio.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
}
