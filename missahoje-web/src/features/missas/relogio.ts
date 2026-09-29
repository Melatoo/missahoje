export interface Relogio {
  diaSemana: number;
  minutos: number;
}

const DIAS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function relogioLocal(agora: Date, timeZone?: string): Relogio {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(agora);

  const parte = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === tipo)?.value ?? '';

  return {
    diaSemana: DIAS[parte('weekday')],
    minutos: Number(parte('hour')) * 60 + Number(parte('minute')),
  };
}

export function horarioEmMinutos(horario: string): number {
  const [h, m] = horario.split(':').map(Number);
  return h * 60 + m;
}
