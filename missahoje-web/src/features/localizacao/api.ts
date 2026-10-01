import { queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types';
import { sortCidades } from './cidades';
import type { Cidade, CidadeSelecionada } from './types';

const CITIES_LIMIT = 100;

export async function fetchCidades(): Promise<CidadeSelecionada[]> {
  const { data } = await api.get<PaginatedResponse<Cidade>>('/cidades', { params: { limit: CITIES_LIMIT } });
  return sortCidades(data.items.map(({ id, nome, estado, slug }) => ({ id, nome, estado, slug })));
}

export function cidadesQuery() {
  return queryOptions({
    queryKey: ['cities'],
    queryFn: fetchCidades,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}
