import { queryOptions, skipToken } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types';
import type { Cidade, CidadeSelecionada, Coordinates } from './types';

const CITIES_LIMIT = 100;

function toSelecionada({ id, nome, estado, slug }: CidadeSelecionada): CidadeSelecionada {
  return { id, nome, estado, slug };
}

export async function fetchCidades(): Promise<CidadeSelecionada[]> {
  const { data } = await api.get<PaginatedResponse<Cidade>>('/cidades', { params: { limit: CITIES_LIMIT } });
  return data.items.map(toSelecionada);
}

export async function fetchCidadeProxima({ lat, lng }: Coordinates): Promise<CidadeSelecionada | null> {
  try {
    const { data } = await api.get<Cidade>('/cidades/proxima', { params: { lat, lng } });
    return toSelecionada(data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

export function cidadeProximaQuery(coordinates: Coordinates | null) {
  return queryOptions({
    queryKey: ['cities', 'nearest', coordinates?.lat, coordinates?.lng],
    queryFn: coordinates ? () => fetchCidadeProxima(coordinates) : skipToken,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}

export function cidadesQuery() {
  return queryOptions({
    queryKey: ['cities'],
    queryFn: fetchCidades,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}
