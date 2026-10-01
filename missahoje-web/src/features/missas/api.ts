import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types';
import { findNextDayWithMasses } from './nextDay';
import type { HorarioMissa } from './types';
import { toWeekday, type Weekday } from './weekday';

type HorarioMissaResponse = Omit<HorarioMissa, 'dia_semana'> & { dia_semana: number };

export interface MassesOfDayQuery {
  cityId: string;
  neighborhood: string | null;
  weekday: Weekday;
}

export async function fetchMassesOfDay({ cityId, neighborhood, weekday }: MassesOfDayQuery): Promise<HorarioMissa[]> {
  const { data } = await api.get<PaginatedResponse<HorarioMissaResponse>>('/missas', {
    params: { cidadeId: cityId, dia_semana: weekday, bairro: neighborhood ?? undefined },
  });
  return data.items.map((mass) => ({ ...mass, dia_semana: toWeekday(mass.dia_semana) }));
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
