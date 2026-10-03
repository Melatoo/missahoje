import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatTime } from '../format';
import type { ScheduleItem } from '../schedule';
import { formatTimeUntil } from '../timeUntil';
import type { HorarioMissa } from '../types';

export type MassCardState = ScheduleItem['state'] | 'neutral';

interface MassCardProps {
  mass: HorarioMissa;
  state: MassCardState;
  minutesUntil?: number;
}

export function MassCard({ mass, state, minutesUntil }: MassCardProps) {
  const community = mass.comunidade;
  const isPast = state === 'past';
  const isNext = state === 'next';

  return (
    <li
      data-state={state}
      className={cn(
        'relative flex min-h-11 items-start gap-4 rounded-2xl bg-surface p-4',
        isPast && 'opacity-40',
        isNext && 'bg-background ring-2 ring-brand',
      )}
    >
      <time
        dateTime={mass.horario.slice(0, 5)}
        className={cn('w-16 shrink-0 text-2xl font-semibold tabular-nums tracking-tight', isPast && 'line-through')}
      >
        {formatTime(mass.horario)}
      </time>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {isNext && minutesUntil !== undefined && (
          <p className="text-sm font-medium text-brand">{formatTimeUntil(minutesUntil)}</p>
        )}
        {community && (
          <Link
            href={`/igreja/${mass.comunidade_id}`}
            className="font-medium leading-snug outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {community.nome}
          </Link>
        )}
        {community?.bairro && <p className="text-sm text-muted-foreground">{community.bairro}</p>}
        {mass.observacao && <p className="text-sm text-muted-foreground">{mass.observacao}</p>}
        {isPast && <span className="sr-only">Já aconteceu.</span>}
      </div>

      <span data-slot="distance" className="shrink-0 text-sm text-muted-foreground tabular-nums" />
    </li>
  );
}
