import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { GetResponse } from '@/types';
import { findNextDayWithMasses } from './nextDay';
import type { HorarioMissaComComunidade } from './types';
import type { Weekday } from './weekday';

export interface MassesOfDayQuery {
  cityId: string;
  neighborhood: string | null;
  weekday: Weekday;
}

export async function fetchMassesOfDay({ cityId, neighborhood, weekday }: MassesOfDayQuery): Promise<HorarioMissaComComunidade[]> {
  const { data } = await api.get<GetResponse<'/missas'>>('/missas', {
    params: { cidadeId: cityId, dia_semana: weekday, bairro: neighborhood ?? undefined },
  });
  return data.items;
}

export function massesOfDayQuery(query: MassesOfDayQuery) {
  return queryOptions({
    queryKey: ['masses', query.cityId, query.neighborhood, query.weekday],
    queryFn: () => fetchMassesOfDay(query),
    retry: 1,
  });
}

export function nextDayWithMassesQuery(query: MassesOfDayQuery, queryClient: QueryClient) {
  return queryOptions({
    queryKey: [...massesOfDayQuery(query).queryKey, 'next-day'],
    queryFn: () =>
      findNextDayWithMasses(query.weekday, (weekday) =>
        queryClient.fetchQuery(massesOfDayQuery({ ...query, weekday })),
      ),
    retry: false,
  });
}
