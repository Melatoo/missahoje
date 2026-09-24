import { parseCoordinates } from './coordinates';
import type { LocalizacaoSalva } from './persistence';
import type { Coordinates } from './types';

export interface SearchParamsLike {
  get(name: string): string | null;
}

export type LocalizacaoInicial =
  | { origem: 'url'; coordinates: Coordinates | null; cidadeSlug: string | null; bairro: string | null }
  | ({ origem: 'cookie' } & LocalizacaoSalva)
  | { origem: 'nenhuma' };

function fromUrl(params: SearchParamsLike): LocalizacaoInicial | null {
  const coordinates = parseCoordinates(params.get('lat'), params.get('lng'));
  const cidadeSlug = params.get('cidade')?.trim() || null;
  if (!coordinates && !cidadeSlug) return null;
  const bairro = cidadeSlug ? params.get('bairro')?.trim() || null : null;
  return { origem: 'url', coordinates, cidadeSlug, bairro };
}

export function resolveInitialLocation(params: SearchParamsLike, salva: LocalizacaoSalva): LocalizacaoInicial {
  const url = fromUrl(params);
  if (url) return url;
  if (salva.coordinates || salva.cidade) return { origem: 'cookie', ...salva };
  return { origem: 'nenhuma' };
}
