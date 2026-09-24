import type { Timestamps } from '@/types';
import type { Comunidade } from '@/features/comunidades/types';

export interface HorarioMissa extends Timestamps {
  id: string;
  comunidade_id: string;
  dia_semana: number;
  horario: string;
  observacao: string | null;
  comunidade?: Comunidade;
}
