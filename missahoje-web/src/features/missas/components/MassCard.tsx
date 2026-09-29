import { cn } from '@/lib/utils';
import { formatarDaquiA } from '../daquiA';
import { formatHorario } from '../format';
import type { HorarioMissa } from '../types';

export type MassCardState = 'passou' | 'proximo' | 'futuro' | 'neutro';

interface MassCardProps {
  missa: HorarioMissa;
  state: MassCardState;
  minutosAte?: number;
}

export function MassCard({ missa, state, minutosAte }: MassCardProps) {
  const comunidade = missa.comunidade;
  const passou = state === 'passou';
  const proximo = state === 'proximo';

  return (
    <li
      data-state={state}
      className={cn(
        'flex min-h-11 items-start gap-4 rounded-2xl bg-surface p-4',
        passou && 'opacity-40',
        proximo && 'bg-background ring-2 ring-brand',
      )}
    >
      <time
        dateTime={missa.horario.slice(0, 5)}
        className={cn('w-16 shrink-0 text-2xl font-semibold tabular-nums tracking-tight', passou && 'line-through')}
      >
        {formatHorario(missa.horario)}
      </time>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {proximo && minutosAte !== undefined && (
          <p className="text-sm font-medium text-brand">{formatarDaquiA(minutosAte)}</p>
        )}
        <p className="font-medium leading-snug">{comunidade?.nome}</p>
        {comunidade?.bairro && <p className="text-sm text-muted-foreground">{comunidade.bairro}</p>}
        {missa.observacao && <p className="text-sm text-muted-foreground">{missa.observacao}</p>}
        {passou && <span className="sr-only">Já aconteceu.</span>}
      </div>

      <span data-slot="distancia" className="shrink-0 text-sm text-muted-foreground tabular-nums" />
    </li>
  );
}
