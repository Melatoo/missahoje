'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useLocalizacaoStore } from '@/features/localizacao/store/useLocalizacaoStore';
import type { Agenda } from '../agenda';
import { describeNextMasses, formatDayHeading, formatDayName, formatDayWithArticle } from '../format';
import { hrefWithBairro, hrefWithDia, parseBairro, parseDia } from '../homeParams';
import { resolveHomeView } from '../homeView';
import { useHomeMissas, type HomeMissas } from '../hooks/useHomeMissas';
import { useNow } from '../hooks/useNow';
import { relogioLocal } from '../relogio';
import { HomeNotice } from './HomeNotice';
import { MassCard } from './MassCard';
import { MassListSkeleton } from './MassListSkeleton';

export function HomeScreen() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const dia = parseDia(searchParams.get('dia'));
  const bairro = parseBairro(searchParams.get('bairro'));

  const initialized = useLocalizacaoStore((state) => state.initialized);
  const initialize = useLocalizacaoStore((state) => state.initialize);
  const cidade = useLocalizacaoStore((state) => state.cidade);

  useEffect(() => {
    if (!initialized) initialize(searchParams);
  }, [initialized, initialize, searchParams]);

  const now = useNow();
  const agora = useMemo(() => relogioLocal(now), [now]);
  const home = useHomeMissas({ cidadeId: cidade?.id ?? null, bairro, dia, agora });
  const view = resolveHomeView({
    initialized,
    hasCidade: cidade !== null,
    status: home.status,
    isEmpty: home.isEmpty,
  });

  const isToday = home.data.mode === 'today';
  const title = home.data.mode === 'today' ? 'Missas de hoje' : `Missas de ${formatDayName(home.data.diaSemana)}`;

  return (
    <section aria-labelledby="missas-titulo" className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 id="missas-titulo" className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {cidade && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>
              {cidade.nome} – {cidade.estado}
            </span>
            {bairro && (
              <Link
                href={hrefWithBairro(query, null)}
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                Bairro {bairro} · ver todos
              </Link>
            )}
          </div>
        )}
        {!isToday && (
          <Link
            href={hrefWithDia(query, null)}
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

      {view === 'empty' && cidade && (
        <EmptyNotice data={home.data} cidadeNome={cidade.nome} bairro={bairro} query={query} hoje={agora.diaSemana} />
      )}

      {view === 'ready' && home.data.mode === 'today' && home.data.agenda && <TodayAgenda agenda={home.data.agenda} />}

      {view === 'ready' && home.data.mode === 'day' && home.data.missas && (
        <ol aria-label={title} className="flex flex-col gap-3">
          {home.data.missas.map((missa) => (
            <MassCard key={missa.id} missa={missa} state="neutro" />
          ))}
        </ol>
      )}
    </section>
  );
}

function TodayAgenda({ agenda }: { agenda: Agenda }) {
  const anuncio = describeNextMasses(agenda);

  return (
    <div className="flex flex-col gap-6">
      {anuncio && <p className="sr-only">{anuncio}</p>}
      {agenda.dias.map((dia) => {
        const headingId = `dia-${dia.deslocamento}`;
        const showHeading = agenda.dias.length > 1 || dia.deslocamento > 0;
        return (
          <section
            key={dia.deslocamento}
            aria-labelledby={showHeading ? headingId : undefined}
            className="flex flex-col gap-3"
          >
            {showHeading && (
              <h2 id={headingId} className="text-sm font-medium text-muted-foreground">
                {formatDayHeading(dia.diaSemana, dia.deslocamento)}
              </h2>
            )}
            <ol aria-label={formatDayHeading(dia.diaSemana, dia.deslocamento)} className="flex flex-col gap-3">
              {dia.itens.map((item) => (
                <MassCard
                  key={item.missa.id}
                  missa={item.missa}
                  state={item.estado}
                  minutosAte={item.estado === 'passou' ? undefined : item.minutosAte}
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
  data: HomeMissas;
  cidadeNome: string;
  bairro: string | null;
  query: string;
  hoje: number;
}

function EmptyNotice({ data, cidadeNome, bairro, query, hoje }: EmptyNoticeProps) {
  const onde = bairro ? `no bairro ${bairro}, em ${cidadeNome}` : `em ${cidadeNome}`;
  const verTodosOsBairros = bairro && (
    <Button asChild variant="outline">
      <Link href={hrefWithBairro(query, null)}>Ver todos os bairros</Link>
    </Button>
  );

  if (data.mode === 'today') {
    return <HomeNotice actions={verTodosOsBairros}>Nenhuma missa cadastrada {onde}.</HomeNotice>;
  }

  const diaSeguinte = (data.diaSemana + 1) % 7;
  return (
    <HomeNotice
      actions={
        <>
          {diaSeguinte !== hoje && (
            <Button asChild variant="outline">
              <Link href={hrefWithDia(query, diaSeguinte)}>Ver {formatDayName(diaSeguinte)}</Link>
            </Button>
          )}
          {verTodosOsBairros}
        </>
      }
    >
      Nenhuma missa {formatDayWithArticle(data.diaSemana)} {onde}.
    </HomeNotice>
  );
}
