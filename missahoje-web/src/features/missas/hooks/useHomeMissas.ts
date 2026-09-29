'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { montarAgenda, missasDoDia, type Agenda } from '../agenda';
import { missasDoDiaQuery } from '../api';
import { findNextDayWithMissas, isDayOver, mergeNextDay } from '../nextDay';
import type { Relogio } from '../relogio';
import type { HorarioMissa } from '../types';

interface UseHomeMissasInput {
  cidadeId: string | null;
  bairro: string | null;
  dia: number | null;
  agora: Relogio;
}

export type HomeMissas =
  | { mode: 'today'; agenda: Agenda | null }
  | { mode: 'day'; diaSemana: number; missas: HorarioMissa[] | null };

export interface UseHomeMissasResult {
  status: 'pending' | 'error' | 'success';
  isEmpty: boolean;
  data: HomeMissas;
  retry: () => void;
}

export function useHomeMissas({ cidadeId, bairro, dia, agora }: UseHomeMissasInput): UseHomeMissasResult {
  const queryClient = useQueryClient();
  const diaSemana = dia ?? agora.diaSemana;
  const isToday = diaSemana === agora.diaSemana;
  const base = { cidadeId: cidadeId ?? '', bairro };

  const day = useQuery({ ...missasDoDiaQuery({ ...base, diaSemana }), enabled: cidadeId !== null });

  const needsNextDay = isToday && day.isSuccess && isDayOver(day.data, agora);
  const nextDay = useQuery({
    queryKey: ['missas', base.cidadeId, bairro, diaSemana, 'proximo-dia'],
    queryFn: () =>
      findNextDayWithMissas(diaSemana, (d) => queryClient.fetchQuery(missasDoDiaQuery({ ...base, diaSemana: d }))),
    enabled: needsNextDay,
  });

  const status = day.status !== 'success' || !needsNextDay ? day.status : nextDay.status;
  const retry = () => {
    if (day.isError) void day.refetch();
    if (nextDay.isError) void nextDay.refetch();
  };

  if (!isToday) {
    const missas = day.data ? missasDoDia(day.data, diaSemana) : null;
    return { status, isEmpty: missas?.length === 0, data: { mode: 'day', diaSemana, missas }, retry };
  }

  const agenda =
    status === 'success' && day.data
      ? montarAgenda(mergeNextDay(day.data, needsNextDay ? (nextDay.data ?? null) : null), agora)
      : null;
  return { status, isEmpty: agenda?.dias.length === 0, data: { mode: 'today', agenda }, retry };
}
