import { describe, expect, it } from 'vitest';
import { describeNextMasses, formatDayHeading, formatDayName, formatDayWithArticle, formatTime } from './format';
import { buildSchedule } from './schedule';
import type { HorarioMissa } from './types';
import type { Weekday } from './weekday';

describe('horário no card', () => {
  it.each([
    ['19:00:00', '19h'],
    ['07:00', '7h'],
    ['07:30:00', '7h30'],
    ['00:05', '0h05'],
  ])('%s → %s', (time, text) => {
    expect(formatTime(time)).toBe(text);
  });
});

describe('título de cada dia da agenda', () => {
  it.each<[Weekday, number, string]>([
    [0, 0, 'Hoje'],
    [1, 1, 'Amanhã'],
    [3, 2, 'Quarta-feira'],
    [0, 7, 'Domingo que vem'],
  ])('dia %i, deslocamento %i → %s', (weekday, offset, text) => {
    expect(formatDayHeading(weekday, offset)).toBe(text);
  });
});

describe('nome do dia', () => {
  it('usa o nome completo em minúsculas', () => {
    expect(formatDayName(6)).toBe('sábado');
    expect(formatDayName(2)).toBe('terça-feira');
  });

  it('usa o artigo certo', () => {
    expect(formatDayWithArticle(0)).toBe('no domingo');
    expect(formatDayWithArticle(3)).toBe('na quarta-feira');
    expect(formatDayWithArticle(6)).toBe('no sábado');
  });
});

describe('anúncio da próxima missa para o leitor de tela', () => {
  function mass(id: string, nome: string, dia_semana: Weekday, horario: string): HorarioMissa {
    return { id, comunidade_id: id, dia_semana, horario, observacao: null, comunidade: { nome } } as HorarioMissa;
  }

  it('uma igreja hoje', () => {
    const schedule = buildSchedule([mass('a', 'Matriz', 0, '19:00')], { weekday: 0, minutes: 18 * 60 + 35 });

    expect(describeNextMasses(schedule)).toBe('Próxima missa: hoje às 19h, em Matriz, daqui a 25 min.');
  });

  it('várias igrejas no mesmo horário', () => {
    const masses = [mass('a', 'Matriz', 0, '19:00'), mass('b', 'Rosário', 0, '19:00'), mass('c', 'Fátima', 0, '19:00')];
    const schedule = buildSchedule(masses, { weekday: 0, minutes: 19 * 60 });

    expect(describeNextMasses(schedule)).toBe('Próximas missas: hoje às 19h, em Matriz, Rosário e Fátima, agora.');
  });

  it('emenda em amanhã', () => {
    const schedule = buildSchedule([mass('a', 'Matriz', 1, '07:30')], { weekday: 0, minutes: 23 * 60 });

    expect(describeNextMasses(schedule)).toBe('Próxima missa: amanhã às 7h30, em Matriz, daqui a 8h 30min.');
  });

  it('agenda vazia não anuncia nada', () => {
    expect(describeNextMasses(buildSchedule([], { weekday: 0, minutes: 0 }))).toBeNull();
  });
});
