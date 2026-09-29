import { horarioEmMinutos, type Relogio } from './relogio';
import type { HorarioMissa } from './types';

export interface NextDay {
  diaSemana: number;
  missas: HorarioMissa[];
}

export function isDayOver(missas: HorarioMissa[], agora: Relogio): boolean {
  return !missas.some((m) => m.dia_semana === agora.diaSemana && horarioEmMinutos(m.horario) >= agora.minutos);
}

export async function findNextDayWithMissas(
  fromDia: number,
  fetchDay: (diaSemana: number) => Promise<HorarioMissa[]>,
): Promise<NextDay | null> {
  for (let d = 1; d <= 7; d++) {
    const diaSemana = (fromDia + d) % 7;
    const missas = await fetchDay(diaSemana);
    if (missas.length > 0) return { diaSemana, missas };
  }
  return null;
}

export function mergeNextDay(hoje: HorarioMissa[], next: NextDay | null): HorarioMissa[] {
  if (!next || next.missas.every((m) => hoje.some((h) => h.id === m.id))) return hoje;
  return [...hoje, ...next.missas];
}
