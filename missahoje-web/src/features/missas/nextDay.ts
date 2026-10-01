import { timeToMinutes, type Clock } from './clock';
import type { HorarioMissa } from './types';
import { addDays, type Weekday } from './weekday';

export interface NextDay {
  weekday: Weekday;
  masses: HorarioMissa[];
}

export function isDayOver(masses: HorarioMissa[], now: Clock): boolean {
  return !masses.some((m) => m.dia_semana === now.weekday && timeToMinutes(m.horario) >= now.minutes);
}

export async function findNextDayWithMasses(
  from: Weekday,
  fetchDay: (weekday: Weekday) => Promise<HorarioMissa[]>,
): Promise<NextDay | null> {
  for (let d = 1; d <= 7; d++) {
    const weekday = addDays(from, d);
    const masses = await fetchDay(weekday);
    if (masses.length > 0) return { weekday, masses };
  }
  return null;
}

export function mergeNextDay(today: HorarioMissa[], next: NextDay | null): HorarioMissa[] {
  if (!next || next.masses.every((m) => today.some((t) => t.id === m.id))) return today;
  return [...today, ...next.masses];
}
