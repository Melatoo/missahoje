import type { Timestamps } from '@/types';
import type { Comunidade } from '@/features/comunidades/types';
import type { Weekday } from './weekday';

export interface HorarioMissa extends Timestamps {
  id: string;
  comunidade_id: string;
  dia_semana: Weekday;
  horario: string;
  observacao: string | null;
  comunidade?: Comunidade;
}
