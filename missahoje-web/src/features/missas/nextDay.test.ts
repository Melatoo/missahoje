import { describe, expect, it, vi } from 'vitest';
import { findNextDayWithMissas, isDayOver, mergeNextDay } from './nextDay';
import type { HorarioMissa } from './types';

function missa(id: string, dia_semana: number, horario: string): HorarioMissa {
  return { id, comunidade_id: 'c1', dia_semana, horario, observacao: null } as HorarioMissa;
}

describe('o dia acabou?', () => {
  const domingo = [missa('7h', 0, '07:00:00'), missa('19h', 0, '19:00:00')];

  it('não, enquanto sobra missa', () => {
    expect(isDayOver(domingo, { diaSemana: 0, minutos: 18 * 60 })).toBe(false);
  });

  it('não, se a última começa exatamente agora', () => {
    expect(isDayOver(domingo, { diaSemana: 0, minutos: 19 * 60 })).toBe(false);
  });

  it('sim, depois da última', () => {
    expect(isDayOver(domingo, { diaSemana: 0, minutos: 19 * 60 + 1 })).toBe(true);
  });

  it('sim, se o dia não tem missa', () => {
    expect(isDayOver([], { diaSemana: 0, minutos: 0 })).toBe(true);
  });
});

describe('busca do próximo dia com missa', () => {
  it('para no primeiro dia que tem missa', async () => {
    const porDia: Record<number, HorarioMissa[]> = { 3: [missa('qua', 3, '19:00')] };
    const fetchDay = vi.fn(async (dia: number) => porDia[dia] ?? []);

    await expect(findNextDayWithMissas(1, fetchDay)).resolves.toEqual({ diaSemana: 3, missas: porDia[3] });
    expect(fetchDay.mock.calls.map(([dia]) => dia)).toEqual([2, 3]);
  });

  it('sábado vira domingo', async () => {
    const fetchDay = vi.fn(async (dia: number) => (dia === 0 ? [missa('dom', 0, '07:00')] : []));

    await expect(findNextDayWithMissas(6, fetchDay)).resolves.toMatchObject({ diaSemana: 0 });
  });

  it('dá a volta na semana e chega no mesmo dia', async () => {
    const fetchDay = vi.fn(async (dia: number) => (dia === 0 ? [missa('dom', 0, '07:00')] : []));

    await expect(findNextDayWithMissas(0, fetchDay)).resolves.toMatchObject({ diaSemana: 0 });
    expect(fetchDay).toHaveBeenCalledTimes(7);
  });

  it('semana sem missa nenhuma devolve null', async () => {
    await expect(findNextDayWithMissas(0, async () => [])).resolves.toBeNull();
  });
});

describe('junta hoje com o próximo dia', () => {
  const hoje = [missa('dom7h', 0, '07:00')];

  it('soma as missas do próximo dia', () => {
    const seg = [missa('seg7h', 1, '07:00')];

    expect(mergeNextDay(hoje, { diaSemana: 1, missas: seg }).map((m) => m.id)).toEqual(['dom7h', 'seg7h']);
  });

  it('não duplica quando o próximo dia é o mesmo da semana que vem', () => {
    expect(mergeNextDay(hoje, { diaSemana: 0, missas: hoje })).toEqual(hoje);
  });

  it('sem próximo dia, fica só hoje', () => {
    expect(mergeNextDay(hoje, null)).toEqual(hoje);
  });
});
