import { describe, expect, it } from 'vitest';
import { horarioEmMinutos, relogioLocal } from './relogio';

describe('relógio local', () => {
  it('lê dia e hora no fuso pedido', () => {
    const agora = new Date('2026-09-27T14:30:00Z');

    expect(relogioLocal(agora, 'America/Sao_Paulo')).toEqual({ diaSemana: 0, minutos: 11 * 60 + 30 });
  });

  it('o mesmo instante cai em outro dia dependendo do fuso', () => {
    const agora = new Date('2026-09-28T02:30:00Z');

    expect(relogioLocal(agora, 'UTC')).toEqual({ diaSemana: 1, minutos: 150 });
    expect(relogioLocal(agora, 'America/Sao_Paulo')).toEqual({ diaSemana: 0, minutos: 23 * 60 + 30 });
    expect(relogioLocal(agora, 'America/Manaus')).toEqual({ diaSemana: 0, minutos: 22 * 60 + 30 });
  });

  it('meia-noite é 0, não 24:00', () => {
    expect(relogioLocal(new Date('2026-09-28T03:00:00Z'), 'America/Sao_Paulo')).toEqual({ diaSemana: 1, minutos: 0 });
  });
});

describe('horário da API em minutos', () => {
  it.each([
    ['07:00', 420],
    ['19:30:00', 1170],
    ['00:00:00', 0],
  ])('%s → %i', (horario, minutos) => {
    expect(horarioEmMinutos(horario)).toBe(minutos);
  });
});
