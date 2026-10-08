import { timeToMinutes, type Clock } from './clock';
import type { HorarioMissa, HorarioMissaComComunidade } from './types';
import { addDays, type Weekday } from './weekday';

const MINUTES_PER_DAY = 24 * 60;

export type ScheduleItem =
  | { mass: HorarioMissaComComunidade; state: 'past' }
  | { mass: HorarioMissaComComunidade; state: 'next' | 'upcoming'; minutesUntil: number };

export interface ScheduleDay {
  weekday: Weekday;
  offset: number;
  items: ScheduleItem[];
}

export interface Schedule {
  days: ScheduleDay[];
  next: HorarioMissaComComunidade[];
  minutesUntilNext: number | null;
}

export function massesOfDay<Mass extends HorarioMissa>(masses: Mass[], weekday: Weekday): Mass[] {
  return masses
    .filter((m) => m.dia_semana === weekday)
    .sort((a, b) => timeToMinutes(a.horario) - timeToMinutes(b.horario));
}

export function buildSchedule(masses: HorarioMissaComComunidade[], now: Clock): Schedule {
  const today = massesOfDay(masses, now.weekday);
  const upcomingToday = today.filter((m) => timeToMinutes(m.horario) >= now.minutes);

  let target = { weekday: now.weekday, offset: 0, masses: upcomingToday };
  for (let d = 1; target.masses.length === 0 && d <= 7; d++) {
    const weekday = addDays(now.weekday, d);
    target = { weekday, offset: d, masses: massesOfDay(masses, weekday) };
  }

  if (target.masses.length === 0) return { days: [], next: [], minutesUntilNext: null };

  const minutesUntil = (m: HorarioMissaComComunidade) =>
    target.offset * MINUTES_PER_DAY + timeToMinutes(m.horario) - now.minutes;
  const minutesUntilNext = minutesUntil(target.masses[0]);
  const next = target.masses.filter((m) => minutesUntil(m) === minutesUntilNext);

  const targetItems: ScheduleItem[] = target.masses.map((mass) => ({
    mass,
    state: minutesUntil(mass) === minutesUntilNext ? 'next' : 'upcoming',
    minutesUntil: minutesUntil(mass),
  }));

  if (target.offset === 0) {
    const past: ScheduleItem[] = today
      .filter((m) => !upcomingToday.includes(m))
      .map((mass) => ({ mass, state: 'past' }));
    return {
      days: [{ weekday: now.weekday, offset: 0, items: [...past, ...targetItems] }],
      next,
      minutesUntilNext,
    };
  }

  const days: ScheduleDay[] = [];
  if (today.length > 0) {
    days.push({
      weekday: now.weekday,
      offset: 0,
      items: today.map((mass) => ({ mass, state: 'past' })),
    });
  }
  days.push({ weekday: target.weekday, offset: target.offset, items: targetItems });

  return { days, next, minutesUntilNext };
}
