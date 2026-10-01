'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useLocalizacaoStore } from '@/features/localizacao/store/useLocalizacaoStore';
import { localClock } from '../clock';
import { describeNextMasses, formatDayHeading, formatDayName, formatDayWithArticle } from '../format';
import { hrefWithDay, hrefWithNeighborhood, parseDay, parseNeighborhood } from '../homeParams';
import { resolveHomeView } from '../homeView';
import { useHomeMasses, type HomeMasses } from '../hooks/useHomeMasses';
import { useNow } from '../hooks/useNow';
import type { Schedule } from '../schedule';
import { addDays, type Weekday } from '../weekday';
import { HomeNotice } from './HomeNotice';
import { MassCard } from './MassCard';
import { MassListSkeleton } from './MassListSkeleton';

export function HomeScreen() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const day = parseDay(searchParams.get('dia'));
  const neighborhood = parseNeighborhood(searchParams.get('bairro'));

  const initialized = useLocalizacaoStore((state) => state.initialized);
  const initialize = useLocalizacaoStore((state) => state.initialize);
  const city = useLocalizacaoStore((state) => state.cidade);

  useEffect(() => {
    if (!initialized) initialize(searchParams);
  }, [initialized, initialize, searchParams]);

  const now = useNow();
  const clock = useMemo(() => localClock(now), [now]);
  const home = useHomeMasses({ cityId: city?.id ?? null, neighborhood, day, now: clock });
  const view = resolveHomeView({
    initialized,
    hasCity: city !== null,
    status: home.status,
    isEmpty: home.isEmpty,
  });

  const { data } = home;
  const isToday = data.mode === 'today';
  const title = isToday ? 'Missas de hoje' : `Missas de ${formatDayName(data.weekday)}`;

  return (
    <section aria-labelledby="missas-titulo" className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 id="missas-titulo" className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {city && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>
              {city.nome} – {city.estado}
            </span>
            {neighborhood && (
              <Link
                href={hrefWithNeighborhood(query, null)}
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                Bairro {neighborhood} · ver todos
              </Link>
            )}
          </div>
        )}
        {!isToday && (
          <Link
            href={hrefWithDay(query, null)}
            className="inline-flex min-h-11 w-fit items-center text-sm font-medium underline underline-offset-4"
          >
            Voltar para hoje
          </Link>
        )}
      </header>

      {view === 'loading' && <MassListSkeleton />}

      {view === 'no-city' && <HomeNotice>Escolha uma cidade para ver os horários.</HomeNotice>}

      {view === 'error' && (
        <HomeNotice
          role="alert"
          actions={<Button onClick={home.retry}>Tentar de novo</Button>}
        >
          Não foi possível carregar os horários. Confira sua conexão e tente de novo.
        </HomeNotice>
      )}

      {view === 'empty' && city && (
        <EmptyNotice data={data} cityName={city.nome} neighborhood={neighborhood} query={query} today={clock.weekday} />
      )}

      {view === 'ready' && isToday && data.schedule && <TodaySchedule schedule={data.schedule} />}

      {view === 'ready' && !isToday && data.masses && (
        <ol aria-label={title} className="flex flex-col gap-3">
          {data.masses.map((mass) => (
            <MassCard key={mass.id} mass={mass} state="neutral" />
          ))}
        </ol>
      )}
    </section>
  );
}

function TodaySchedule({ schedule }: { schedule: Schedule }) {
  const announcement = describeNextMasses(schedule);

  return (
    <div className="flex flex-col gap-6">
      {announcement && <p className="sr-only">{announcement}</p>}
      {schedule.days.map((day) => {
        const headingId = `day-${day.offset}`;
        const showHeading = schedule.days.length > 1 || day.offset > 0;
        return (
          <section
            key={day.offset}
            aria-labelledby={showHeading ? headingId : undefined}
            className="flex flex-col gap-3"
          >
            {showHeading && (
              <h2 id={headingId} className="text-sm font-medium text-muted-foreground">
                {formatDayHeading(day.weekday, day.offset)}
              </h2>
            )}
            <ol aria-label={formatDayHeading(day.weekday, day.offset)} className="flex flex-col gap-3">
              {day.items.map((item) => (
                <MassCard
                  key={item.mass.id}
                  mass={item.mass}
                  state={item.state}
                  minutesUntil={item.state === 'past' ? undefined : item.minutesUntil}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

interface EmptyNoticeProps {
  data: HomeMasses;
  cityName: string;
  neighborhood: string | null;
  query: string;
  today: Weekday;
}

function EmptyNotice({ data, cityName, neighborhood, query, today }: EmptyNoticeProps) {
  const where = neighborhood ? `no bairro ${neighborhood}, em ${cityName}` : `em ${cityName}`;
  const seeAllNeighborhoods = neighborhood && (
    <Button asChild variant="outline">
      <Link href={hrefWithNeighborhood(query, null)}>Ver todos os bairros</Link>
    </Button>
  );

  if (data.mode === 'today') {
    return <HomeNotice actions={seeAllNeighborhoods}>Nenhuma missa cadastrada {where}.</HomeNotice>;
  }

  const nextDay = addDays(data.weekday, 1);
  return (
    <HomeNotice
      actions={
        <>
          {nextDay !== today && (
            <Button asChild variant="outline">
              <Link href={hrefWithDay(query, nextDay)}>Ver {formatDayName(nextDay)}</Link>
            </Button>
          )}
          {seeAllNeighborhoods}
        </>
      }
    >
      Nenhuma missa {formatDayWithArticle(data.weekday)} {where}.
    </HomeNotice>
  );
}
