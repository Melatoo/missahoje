import { queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types';
import type { HorarioMissa } from './types';

export interface MissasDoDiaQuery {
  cidadeId: string;
  bairro: string | null;
  diaSemana: number;
}

export async function fetchMissasDoDia({ cidadeId, bairro, diaSemana }: MissasDoDiaQuery): Promise<HorarioMissa[]> {
  const { data } = await api.get<PaginatedResponse<HorarioMissa>>('/missas', {
    params: { cidadeId, dia_semana: diaSemana, bairro: bairro ?? undefined },
  });
  return data.items;
}

export function missasDoDiaQuery(query: MissasDoDiaQuery) {
  return queryOptions({
    queryKey: ['missas', query.cidadeId, query.bairro, query.diaSemana],
    queryFn: () => fetchMissasDoDia(query),
  });
}
