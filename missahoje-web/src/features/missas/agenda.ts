import { horarioEmMinutos, type Relogio } from './relogio';
import type { HorarioMissa } from './types';

const MINUTOS_NO_DIA = 24 * 60;

export type ItemAgenda =
  | { missa: HorarioMissa; estado: 'passou' }
  | { missa: HorarioMissa; estado: 'proximo' | 'futuro'; minutosAte: number };

export interface DiaAgenda {
  diaSemana: number;
  /** 0 = hoje, 1 = amanhã… */
  deslocamento: number;
  itens: ItemAgenda[];
}

export interface Agenda {
  /** Hoje (se tiver missa) e, quando hoje já acabou, o próximo dia que tem missa. */
  dias: DiaAgenda[];
  /** Todas as missas no próximo horário — várias igrejas podem ter missa na mesma hora. */
  proximas: HorarioMissa[];
  /** `null` só quando não há nenhuma missa cadastrada na semana. */
  minutosAteProxima: number | null;
}

function missasDoDia(missas: HorarioMissa[], diaSemana: number): HorarioMissa[] {
  return missas
    .filter((m) => m.dia_semana === diaSemana)
    .sort((a, b) => horarioEmMinutos(a.horario) - horarioEmMinutos(b.horario));
}

/**
 * Classifica os horários em passou / próximo / futuro a partir de `agora`.
 * Quando não sobra nenhum horário hoje, emenda no próximo dia que tem missa (até uma semana à frente).
 */
export function montarAgenda(missas: HorarioMissa[], agora: Relogio): Agenda {
  const hoje = missasDoDia(missas, agora.diaSemana);
  const futurasHoje = hoje.filter((m) => horarioEmMinutos(m.horario) >= agora.minutos);

  let alvo = { diaSemana: agora.diaSemana, deslocamento: 0, missas: futurasHoje };
  for (let d = 1; alvo.missas.length === 0 && d <= 7; d++) {
    const diaSemana = (agora.diaSemana + d) % 7;
    alvo = { diaSemana, deslocamento: d, missas: missasDoDia(missas, diaSemana) };
  }

  if (alvo.missas.length === 0) return { dias: [], proximas: [], minutosAteProxima: null };

  const minutosAte = (m: HorarioMissa) =>
    alvo.deslocamento * MINUTOS_NO_DIA + horarioEmMinutos(m.horario) - agora.minutos;
  const minutosAteProxima = minutosAte(alvo.missas[0]);
  const proximas = alvo.missas.filter((m) => minutosAte(m) === minutosAteProxima);

  const itensAlvo: ItemAgenda[] = alvo.missas.map((missa) => ({
    missa,
    estado: minutosAte(missa) === minutosAteProxima ? 'proximo' : 'futuro',
    minutosAte: minutosAte(missa),
  }));

  if (alvo.deslocamento === 0) {
    const passadas: ItemAgenda[] = hoje
      .filter((m) => !futurasHoje.includes(m))
      .map((missa) => ({ missa, estado: 'passou' }));
    return {
      dias: [{ diaSemana: agora.diaSemana, deslocamento: 0, itens: [...passadas, ...itensAlvo] }],
      proximas,
      minutosAteProxima,
    };
  }

  const dias: DiaAgenda[] = [];
  if (hoje.length > 0) {
    dias.push({
      diaSemana: agora.diaSemana,
      deslocamento: 0,
      itens: hoje.map((missa) => ({ missa, estado: 'passou' })),
    });
  }
  dias.push({ diaSemana: alvo.diaSemana, deslocamento: alvo.deslocamento, itens: itensAlvo });

  return { dias, proximas, minutosAteProxima };
}
