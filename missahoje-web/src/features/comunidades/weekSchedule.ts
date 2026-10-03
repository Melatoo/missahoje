import { massesOfDay } from '../missas/schedule';
import type { HorarioMissa } from '../missas/types';
import { addDays, type Weekday } from '../missas/weekday';

export interface WeekScheduleDay {
  weekday: Weekday;
  offset: number;
  masses: HorarioMissa[];
}

export function buildWeekSchedule(masses: HorarioMissa[], today: Weekday): WeekScheduleDay[] {
  return Array.from({ length: 7 }, (_, offset) => {
    const weekday = addDays(today, offset);
    return { weekday, offset, masses: massesOfDay(masses, weekday) };
  }).filter((day) => day.masses.length > 0);
}
