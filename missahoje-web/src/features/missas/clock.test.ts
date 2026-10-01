import { describe, expect, it } from 'vitest';
import { localClock, timeToMinutes } from './clock';

describe('relógio local', () => {
  it('lê dia e hora no fuso pedido', () => {
    const now = new Date('2026-09-27T14:30:00Z');

    expect(localClock(now, 'America/Sao_Paulo')).toEqual({ weekday: 0, minutes: 11 * 60 + 30 });
  });

  it('o mesmo instante cai em outro dia dependendo do fuso', () => {
    const now = new Date('2026-09-28T02:30:00Z');

    expect(localClock(now, 'UTC')).toEqual({ weekday: 1, minutes: 150 });
    expect(localClock(now, 'America/Sao_Paulo')).toEqual({ weekday: 0, minutes: 23 * 60 + 30 });
    expect(localClock(now, 'America/Manaus')).toEqual({ weekday: 0, minutes: 22 * 60 + 30 });
  });

  it('meia-noite é 0, não 24:00', () => {
    expect(localClock(new Date('2026-09-28T03:00:00Z'), 'America/Sao_Paulo')).toEqual({ weekday: 1, minutes: 0 });
  });
});

describe('horário da API em minutos', () => {
  it.each([
    ['07:00', 420],
    ['19:30:00', 1170],
    ['00:00:00', 0],
  ])('%s → %i', (time, minutes) => {
    expect(timeToMinutes(time)).toBe(minutes);
  });
});
