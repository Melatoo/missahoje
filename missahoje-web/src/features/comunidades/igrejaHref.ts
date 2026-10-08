import type { Comunidade } from './types';

type IgrejaLink = Pick<Comunidade, 'id' | 'nome'> & { cidade?: { nome: string } | null };

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Só para leitura (URL pública e indexada): quem identifica a igreja é o id
export function igrejaSlug({ nome, cidade }: IgrejaLink): string {
  return slugify(cidade ? `${nome} ${cidade.nome}` : nome);
}

export function igrejaHref(comunidade: IgrejaLink): string {
  const slug = igrejaSlug(comunidade);
  return slug ? `/igreja/${comunidade.id}/${slug}` : `/igreja/${comunidade.id}`;
}
