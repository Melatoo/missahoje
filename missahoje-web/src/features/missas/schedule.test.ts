import { describe, expect, it } from 'vitest';
import { buildSchedule } from './schedule';
import type { HorarioMissa } from './types';
import type { Weekday } from './weekday';

const SUN = 0;
const MON = 1;
const SAT = 6;

function mass(id: string, dia_semana: Weekday, horario: string): HorarioMissa {
  return {
    id,
    comunidade_id: 'c1',
    dia_semana,
    horario,
    observacao: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    deletedAt: null,
  };
}

const h = (hour: number, minute = 0) => hour * 60 + minute;

function summary(schedule: ReturnType<typeof buildSchedule>) {
  return schedule.days.map((d) => ({
    weekday: d.weekday,
    offset: d.offset,
    items: d.items.map((i) => `${i.mass.id}:${i.state}`),
  }));
}

describe('agenda do dia', () => {
  const sunday = [
    mass('19h', SUN, '19:00:00'),
    mass('7h', SUN, '07:00:00'),
    mass('10h', SUN, '10:00:00'),
    mass('mon7h', MON, '07:00:00'),
  ];

  it('às 9h: 7h passou, 10h é a próxima, 19h ainda vai acontecer', () => {
    const schedule = buildSchedule(sunday, { weekday: SUN, minutes: h(9, 35) });

    expect(summary(schedule)).toEqual([{ weekday: SUN, offset: 0, items: ['7h:past', '10h:next', '19h:upcoming'] }]);
    expect(schedule.minutesUntilNext).toBe(25);
    expect(schedule.next.map((m) => m.id)).toEqual(['10h']);
  });

  it('antes da primeira missa, nada passou', () => {
    const schedule = buildSchedule(sunday, { weekday: SUN, minutes: h(6) });

    expect(summary(schedule)[0].items).toEqual(['7h:next', '10h:upcoming', '19h:upcoming']);
  });

  it('missa começando exatamente agora ainda é a próxima', () => {
    const schedule = buildSchedule(sunday, { weekday: SUN, minutes: h(10) });

    expect(summary(schedule)[0].items).toEqual(['7h:past', '10h:next', '19h:upcoming']);
    expect(schedule.minutesUntilNext).toBe(0);
  });

  it('várias igrejas no mesmo horário são todas "próximo"', () => {
    const masses = [mass('a', SUN, '19:00:00'), mass('b', SUN, '19:00:00'), mass('c', SUN, '20:00:00')];
    const schedule = buildSchedule(masses, { weekday: SUN, minutes: h(18) });

    expect(summary(schedule)[0].items).toEqual(['a:next', 'b:next', 'c:upcoming']);
    expect(schedule.next.map((m) => m.id)).toEqual(['a', 'b']);
  });

  it('ignora missas de outros dias', () => {
    const schedule = buildSchedule(sunday, { weekday: SUN, minutes: h(9) });

    expect(schedule.days[0].items.map((i) => i.mass.id)).not.toContain('mon7h');
  });
});

describe('emenda no dia seguinte', () => {
  it('domingo 23h: mostra o domingo riscado e emenda na segunda (dia_semana 0 → 1)', () => {
    const masses = [mass('sun19h', SUN, '19:00:00'), mass('mon7h', MON, '07:00:00'), mass('mon19h', MON, '19:00')];
    const schedule = buildSchedule(masses, { weekday: SUN, minutes: h(23) });

    expect(summary(schedule)).toEqual([
      { weekday: SUN, offset: 0, items: ['sun19h:past'] },
      { weekday: MON, offset: 1, items: ['mon7h:next', 'mon19h:upcoming'] },
    ]);
    expect(schedule.minutesUntilNext).toBe(h(8));
  });

  it('sábado → domingo fecha a volta da semana (dia_semana 6 → 0)', () => {
    const masses = [mass('sun7h', SUN, '07:00:00')];
    const schedule = buildSchedule(masses, { weekday: SAT, minutes: h(22) });

    expect(summary(schedule)).toEqual([{ weekday: SUN, offset: 1, items: ['sun7h:next'] }]);
    expect(schedule.minutesUntilNext).toBe(h(9));
  });

  it('virada da meia-noite: 23:59 com missa às 00:30', () => {
    const masses = [mass('dawn', MON, '00:30:00')];
    const schedule = buildSchedule(masses, { weekday: SUN, minutes: h(23, 59) });

    expect(schedule.minutesUntilNext).toBe(31);
  });

  it('dia sem nenhuma missa pula para o próximo dia que tenha', () => {
    const masses = [mass('wed', 3, '19:00:00')];
    const schedule = buildSchedule(masses, { weekday: MON, minutes: h(8) });

    expect(summary(schedule)).toEqual([{ weekday: 3, offset: 2, items: ['wed:next'] }]);
    expect(schedule.minutesUntilNext).toBe(2 * 24 * 60 + h(11));
  });

  it('só há missa hoje e ela já passou: a próxima é a da semana que vem', () => {
    const masses = [mass('sun7h', SUN, '07:00:00')];
    const schedule = buildSchedule(masses, { weekday: SUN, minutes: h(9) });

    expect(summary(schedule)).toEqual([
      { weekday: SUN, offset: 0, items: ['sun7h:past'] },
      { weekday: SUN, offset: 7, items: ['sun7h:next'] },
    ]);
  });

  it('nenhuma missa cadastrada: agenda vazia', () => {
    expect(buildSchedule([], { weekday: SUN, minutes: h(9) })).toEqual({
      days: [],
      next: [],
      minutesUntilNext: null,
    });
  });
});
