import { describe, expect, it, vi } from 'vitest';
import { findNextDayWithMasses, isDayOver, mergeNextDay } from './nextDay';
import type { HorarioMissa } from './types';
import type { Weekday } from './weekday';

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

describe('o dia acabou?', () => {
  const sunday = [mass('7h', 0, '07:00:00'), mass('19h', 0, '19:00:00')];

  it('não, enquanto sobra missa', () => {
    expect(isDayOver(sunday, { weekday: 0, minutes: 18 * 60 })).toBe(false);
  });

  it('não, se a última começa exatamente agora', () => {
    expect(isDayOver(sunday, { weekday: 0, minutes: 19 * 60 })).toBe(false);
  });

  it('sim, depois da última', () => {
    expect(isDayOver(sunday, { weekday: 0, minutes: 19 * 60 + 1 })).toBe(true);
  });

  it('sim, se o dia não tem missa', () => {
    expect(isDayOver([], { weekday: 0, minutes: 0 })).toBe(true);
  });
});

describe('busca do próximo dia com missa', () => {
  it('busca a semana de uma vez e fica com o primeiro dia que tem missa', async () => {
    const byDay: Partial<Record<Weekday, HorarioMissa[]>> = {
      3: [mass('wed', 3, '19:00')],
      5: [mass('fri', 5, '19:00')],
    };
    const fetchDay = vi.fn(async (weekday: Weekday) => byDay[weekday] ?? []);

    await expect(findNextDayWithMasses(1, fetchDay)).resolves.toEqual({ weekday: 3, masses: byDay[3] });
    expect(fetchDay.mock.calls.map(([weekday]) => weekday)).toEqual([2, 3, 4, 5, 6, 0, 1]);
  });

  it('sábado vira domingo', async () => {
    const fetchDay = vi.fn(async (weekday: Weekday) => (weekday === 0 ? [mass('sun', 0, '07:00')] : []));

    await expect(findNextDayWithMasses(6, fetchDay)).resolves.toMatchObject({ weekday: 0 });
  });

  it('dá a volta na semana e chega no mesmo dia', async () => {
    const fetchDay = vi.fn(async (weekday: Weekday) => (weekday === 0 ? [mass('sun', 0, '07:00')] : []));

    await expect(findNextDayWithMasses(0, fetchDay)).resolves.toMatchObject({ weekday: 0 });
    expect(fetchDay).toHaveBeenCalledTimes(7);
  });

  it('semana sem missa nenhuma devolve null', async () => {
    await expect(findNextDayWithMasses(0, async () => [])).resolves.toBeNull();
  });
});

describe('junta hoje com o próximo dia', () => {
  const today = [mass('sun7h', 0, '07:00')];

  it('soma as missas do próximo dia', () => {
    const monday = [mass('mon7h', 1, '07:00')];

    expect(mergeNextDay(today, { weekday: 1, masses: monday }).map((m) => m.id)).toEqual(['sun7h', 'mon7h']);
  });

  it('não duplica quando o próximo dia é o mesmo da semana que vem', () => {
    expect(mergeNextDay(today, { weekday: 0, masses: today })).toEqual(today);
  });

  it('sem próximo dia, fica só hoje', () => {
    expect(mergeNextDay(today, null)).toEqual(today);
  });
});
