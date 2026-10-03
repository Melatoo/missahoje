import { describe, expect, it } from 'vitest';
import type { HorarioMissa } from '../missas/types';
import type { Weekday } from '../missas/weekday';
import { buildWeekSchedule } from './weekSchedule';

function mass(id: string, dia_semana: Weekday, horario: string): HorarioMissa {
  return { id, comunidade_id: 'c1', dia_semana, horario, observacao: null } as HorarioMissa;
}

function summary(days: ReturnType<typeof buildWeekSchedule>) {
  return days.map((d) => `${d.offset}/${d.weekday}: ${d.masses.map((m) => m.id).join(',')}`);
}

describe('horários da semana de uma igreja', () => {
  const masses = [
    mass('dom19', 0, '19:00:00'),
    mass('dom7', 0, '07:00:00'),
    mass('qua19', 3, '19:00:00'),
    mass('sab17', 6, '17:00:00'),
  ];

  it('começa por hoje, segue a ordem da semana e ordena os horários de cada dia', () => {
    expect(summary(buildWeekSchedule(masses, 3))).toEqual(['0/3: qua19', '3/6: sab17', '4/0: dom7,dom19']);
  });

  it('dá a volta na semana a partir do sábado', () => {
    expect(summary(buildWeekSchedule(masses, 6))).toEqual(['0/6: sab17', '1/0: dom7,dom19', '4/3: qua19']);
  });

  it('omite os dias sem missa, inclusive hoje', () => {
    expect(summary(buildWeekSchedule(masses, 1))).toEqual(['2/3: qua19', '5/6: sab17', '6/0: dom7,dom19']);
  });

  it('sem horários, não há dias', () => {
    expect(buildWeekSchedule([], 0)).toEqual([]);
  });
});
