import { describe, expect, it } from 'vitest';
import { montarAgenda } from './agenda';
import type { HorarioMissa } from './types';

const DOM = 0;
const SEG = 1;
const SAB = 6;

function missa(id: string, dia_semana: number, horario: string): HorarioMissa {
  return {
    id,
    comunidade_id: 'c1',
    dia_semana,
    horario,
    observacao: null,
  } as HorarioMissa;
}

const h = (hora: number, minuto = 0) => hora * 60 + minuto;

function resumo(agenda: ReturnType<typeof montarAgenda>) {
  return agenda.dias.map((d) => ({
    dia: d.diaSemana,
    deslocamento: d.deslocamento,
    itens: d.itens.map((i) => `${i.missa.id}:${i.estado}`),
  }));
}

describe('agenda do dia', () => {
  const domingo = [
    missa('19h', DOM, '19:00:00'),
    missa('7h', DOM, '07:00:00'),
    missa('10h', DOM, '10:00:00'),
    missa('seg7h', SEG, '07:00:00'),
  ];

  it('às 9h: 7h passou, 10h é a próxima, 19h ainda vai acontecer', () => {
    const agenda = montarAgenda(domingo, { diaSemana: DOM, minutos: h(9, 35) });

    expect(resumo(agenda)).toEqual([{ dia: DOM, deslocamento: 0, itens: ['7h:passou', '10h:proximo', '19h:futuro'] }]);
    expect(agenda.minutosAteProxima).toBe(25);
    expect(agenda.proximas.map((m) => m.id)).toEqual(['10h']);
  });

  it('antes da primeira missa, nada passou', () => {
    const agenda = montarAgenda(domingo, { diaSemana: DOM, minutos: h(6) });

    expect(resumo(agenda)[0].itens).toEqual(['7h:proximo', '10h:futuro', '19h:futuro']);
  });

  it('missa começando exatamente agora ainda é a próxima', () => {
    const agenda = montarAgenda(domingo, { diaSemana: DOM, minutos: h(10) });

    expect(resumo(agenda)[0].itens).toEqual(['7h:passou', '10h:proximo', '19h:futuro']);
    expect(agenda.minutosAteProxima).toBe(0);
  });

  it('várias igrejas no mesmo horário são todas "próximo"', () => {
    const missas = [missa('a', DOM, '19:00:00'), missa('b', DOM, '19:00:00'), missa('c', DOM, '20:00:00')];
    const agenda = montarAgenda(missas, { diaSemana: DOM, minutos: h(18) });

    expect(resumo(agenda)[0].itens).toEqual(['a:proximo', 'b:proximo', 'c:futuro']);
    expect(agenda.proximas.map((m) => m.id)).toEqual(['a', 'b']);
  });

  it('ignora missas de outros dias', () => {
    const agenda = montarAgenda(domingo, { diaSemana: DOM, minutos: h(9) });

    expect(agenda.dias[0].itens.map((i) => i.missa.id)).not.toContain('seg7h');
  });
});

describe('emenda no dia seguinte', () => {
  it('domingo 23h: mostra o domingo riscado e emenda na segunda (dia_semana 0 → 1)', () => {
    const missas = [missa('dom19h', DOM, '19:00:00'), missa('seg7h', SEG, '07:00:00'), missa('seg19h', SEG, '19:00')];
    const agenda = montarAgenda(missas, { diaSemana: DOM, minutos: h(23) });

    expect(resumo(agenda)).toEqual([
      { dia: DOM, deslocamento: 0, itens: ['dom19h:passou'] },
      { dia: SEG, deslocamento: 1, itens: ['seg7h:proximo', 'seg19h:futuro'] },
    ]);
    expect(agenda.minutosAteProxima).toBe(h(8));
  });

  it('sábado → domingo fecha a volta da semana (dia_semana 6 → 0)', () => {
    const missas = [missa('dom7h', DOM, '07:00:00')];
    const agenda = montarAgenda(missas, { diaSemana: SAB, minutos: h(22) });

    expect(resumo(agenda)).toEqual([{ dia: DOM, deslocamento: 1, itens: ['dom7h:proximo'] }]);
    expect(agenda.minutosAteProxima).toBe(h(9));
  });

  it('virada da meia-noite: 23:59 com missa às 00:30', () => {
    const missas = [missa('madrugada', SEG, '00:30:00')];
    const agenda = montarAgenda(missas, { diaSemana: DOM, minutos: h(23, 59) });

    expect(agenda.minutosAteProxima).toBe(31);
  });

  it('dia sem nenhuma missa pula para o próximo dia que tenha', () => {
    const missas = [missa('qua', 3, '19:00:00')];
    const agenda = montarAgenda(missas, { diaSemana: SEG, minutos: h(8) });

    expect(resumo(agenda)).toEqual([{ dia: 3, deslocamento: 2, itens: ['qua:proximo'] }]);
    expect(agenda.minutosAteProxima).toBe(2 * 24 * 60 + h(11));
  });

  it('só há missa hoje e ela já passou: a próxima é a da semana que vem', () => {
    const missas = [missa('dom7h', DOM, '07:00:00')];
    const agenda = montarAgenda(missas, { diaSemana: DOM, minutos: h(9) });

    expect(resumo(agenda)).toEqual([
      { dia: DOM, deslocamento: 0, itens: ['dom7h:passou'] },
      { dia: DOM, deslocamento: 7, itens: ['dom7h:proximo'] },
    ]);
  });

  it('nenhuma missa cadastrada: agenda vazia', () => {
    expect(montarAgenda([], { diaSemana: DOM, minutos: h(9) })).toEqual({
      dias: [],
      proximas: [],
      minutosAteProxima: null,
    });
  });
});
