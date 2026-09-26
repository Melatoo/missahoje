export interface Relogio {
  /** 0 = domingo … 6 = sábado, como o `dia_semana` da API. */
  diaSemana: number;
  /** Minutos desde a meia-noite. */
  minutos: number;
}

const DIAS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/**
 * Lê o dia da semana e a hora de `agora` no fuso `timeZone`.
 * Sem `timeZone`, usa o fuso do dispositivo.
 */
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

/** Converte o `horario` da API (`"19:30"` ou `"19:30:00"`) em minutos desde a meia-noite. */
export function horarioEmMinutos(horario: string): number {
  const [h, m] = horario.split(':').map(Number);
  return h * 60 + m;
}
