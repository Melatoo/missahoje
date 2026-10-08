'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { massesOfDayQuery, nextDayWithMassesQuery } from '../api';
import type { Clock } from '../clock';
import type { FetchStatus } from '../homeView';
import { isDayOver, mergeNextDay } from '../nextDay';
import { buildSchedule, massesOfDay, type Schedule } from '../schedule';
import type { HorarioMissaComComunidade } from '../types';
import type { Weekday } from '../weekday';

interface UseHomeMassesInput {
  cityId: string | null;
  neighborhood: string | null;
  day: Weekday | null;
  now: Clock;
}

export type HomeMasses =
  | { mode: 'today'; schedule: Schedule | null }
  | { mode: 'day'; weekday: Weekday; masses: HorarioMissaComComunidade[] | null };

export interface UseHomeMassesResult {
  status: FetchStatus;
  isEmpty: boolean;
  data: HomeMasses;
  retry: () => void;
}

export function useHomeMasses({ cityId, neighborhood, day, now }: UseHomeMassesInput): UseHomeMassesResult {
  const queryClient = useQueryClient();
  const weekday = day ?? now.weekday;
  const isToday = weekday === now.weekday;
  const query = { cityId: cityId ?? '', neighborhood, weekday };

  const dayQuery = useQuery({ ...massesOfDayQuery(query), enabled: cityId !== null });

  const needsNextDay = isToday && dayQuery.isSuccess && isDayOver(dayQuery.data, now);
  const nextDayQuery = useQuery({ ...nextDayWithMassesQuery(query, queryClient), enabled: needsNextDay });

  const status = dayQuery.status !== 'success' || !needsNextDay ? dayQuery.status : nextDayQuery.status;
  const retry = () => {
    if (dayQuery.isError) void dayQuery.refetch();
    if (nextDayQuery.isError) void nextDayQuery.refetch();
  };

  if (!isToday) {
    const masses = dayQuery.data ? massesOfDay(dayQuery.data, weekday) : null;
    return { status, isEmpty: masses?.length === 0, data: { mode: 'day', weekday, masses }, retry };
  }

  const schedule =
    status === 'success' && dayQuery.data
      ? buildSchedule(mergeNextDay(dayQuery.data, needsNextDay ? (nextDayQuery.data ?? null) : null), now)
      : null;
  return { status, isEmpty: schedule?.days.length === 0, data: { mode: 'today', schedule }, retry };
}
