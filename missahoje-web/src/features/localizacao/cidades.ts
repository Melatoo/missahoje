import type { CidadeSelecionada } from './types';

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

export function normalizeSearch(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

export function cidadeLabel({ nome, estado }: Pick<CidadeSelecionada, 'nome' | 'estado'>): string {
  return `${nome} – ${estado}`;
}

export function sortCidades<T extends CidadeSelecionada>(cidades: T[]): T[] {
  return [...cidades].sort((a, b) => collator.compare(a.nome, b.nome) || collator.compare(a.estado, b.estado));
}

export function filterCidades<T extends CidadeSelecionada>(cidades: T[], term: string): T[] {
  const sorted = sortCidades(cidades);
  const search = normalizeSearch(term);
  if (!search) return sorted;

  const prefix: T[] = [];
  const wordPrefix: T[] = [];
  for (const cidade of sorted) {
    const nome = normalizeSearch(cidade.nome);
    if (nome.startsWith(search)) prefix.push(cidade);
    else if (nome.split(/[\s-]+/).some((word) => word.startsWith(search))) wordPrefix.push(cidade);
  }
  return [...prefix, ...wordPrefix];
}

export function findCidadeBySlug<T extends CidadeSelecionada>(cidades: T[], slug: string): T | null {
  const search = slug.trim().toLowerCase();
  return cidades.find((cidade) => cidade.slug.toLowerCase() === search) ?? null;
}
