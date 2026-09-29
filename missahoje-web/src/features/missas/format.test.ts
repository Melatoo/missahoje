import { describe, expect, it } from 'vitest';
import { montarAgenda } from './agenda';
import { describeNextMasses, formatDayHeading, formatDayName, formatDayWithArticle, formatHorario } from './format';
import type { HorarioMissa } from './types';

describe('horário no card', () => {
  it.each([
    ['19:00:00', '19h'],
    ['07:00', '7h'],
    ['07:30:00', '7h30'],
    ['00:05', '0h05'],
  ])('%s → %s', (horario, texto) => {
    expect(formatHorario(horario)).toBe(texto);
  });
});

describe('título de cada dia da agenda', () => {
  it.each([
    [0, 0, 'Hoje'],
    [1, 1, 'Amanhã'],
    [3, 2, 'Quarta-feira'],
    [0, 7, 'Domingo que vem'],
  ])('dia %i, deslocamento %i → %s', (diaSemana, deslocamento, texto) => {
    expect(formatDayHeading(diaSemana, deslocamento)).toBe(texto);
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
  function missa(id: string, nome: string, dia_semana: number, horario: string): HorarioMissa {
    return { id, comunidade_id: id, dia_semana, horario, observacao: null, comunidade: { nome } } as HorarioMissa;
  }

  it('uma igreja hoje', () => {
    const agenda = montarAgenda([missa('a', 'Matriz', 0, '19:00')], { diaSemana: 0, minutos: 18 * 60 + 35 });

    expect(describeNextMasses(agenda)).toBe('Próxima missa: hoje às 19h, em Matriz, daqui a 25 min.');
  });

  it('várias igrejas no mesmo horário', () => {
    const missas = [missa('a', 'Matriz', 0, '19:00'), missa('b', 'Rosário', 0, '19:00'), missa('c', 'Fátima', 0, '19:00')];
    const agenda = montarAgenda(missas, { diaSemana: 0, minutos: 19 * 60 });

    expect(describeNextMasses(agenda)).toBe('Próximas missas: hoje às 19h, em Matriz, Rosário e Fátima, agora.');
  });

  it('emenda em amanhã', () => {
    const agenda = montarAgenda([missa('a', 'Matriz', 1, '07:30')], { diaSemana: 0, minutos: 23 * 60 });

    expect(describeNextMasses(agenda)).toBe('Próxima missa: amanhã às 7h30, em Matriz, daqui a 8h 30min.');
  });

  it('agenda vazia não anuncia nada', () => {
    expect(describeNextMasses(montarAgenda([], { diaSemana: 0, minutos: 0 }))).toBeNull();
  });
});
