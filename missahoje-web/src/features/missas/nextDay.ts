import { timeToMinutes, type Clock } from './clock';
import type { HorarioMissaComComunidade } from './types';
import { addDays, type Weekday } from './weekday';

export interface NextDay {
  weekday: Weekday;
  masses: HorarioMissaComComunidade[];
}

export function isDayOver(masses: HorarioMissaComComunidade[], now: Clock): boolean {
  return !masses.some((m) => m.dia_semana === now.weekday && timeToMinutes(m.horario) >= now.minutes);
}

export async function findNextDayWithMasses(
  from: Weekday,
  fetchDay: (weekday: Weekday) => Promise<HorarioMissaComComunidade[]>,
): Promise<NextDay | null> {
  const weekdays = Array.from({ length: 7 }, (_, i) => addDays(from, i + 1));
  const results = await Promise.all(weekdays.map((weekday) => fetchDay(weekday)));
  const index = results.findIndex((masses) => masses.length > 0);
  return index === -1 ? null : { weekday: weekdays[index], masses: results[index] };
}

export function mergeNextDay(today: HorarioMissaComComunidade[], next: NextDay | null): HorarioMissaComComunidade[] {
  if (!next || next.masses.every((m) => today.some((t) => t.id === m.id))) return today;
  return [...today, ...next.masses];
}
