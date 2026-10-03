import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { connection } from 'next/server';
import { cache } from 'react';
import { fetchComunidade } from '@/features/comunidades/api';
import { ChurchDetail } from '@/features/comunidades/components/ChurchDetail';
import { igrejaHref, igrejaSlug } from '@/features/comunidades/igrejaHref';
import { APP_TIME_ZONE, localClock } from '@/features/missas/clock';

// Página e metadata pedem a mesma comunidade: uma chamada à API por requisição
const getComunidade = cache(fetchComunidade);

interface IgrejaPageProps {
  params: Promise<{ id: string; slug?: string[] }>;
}

export async function generateMetadata({ params }: IgrejaPageProps): Promise<Metadata> {
  const { id } = await params;
  const comunidade = await getComunidade(id);
  if (!comunidade) return { title: 'Igreja não encontrada | Missa Hoje' };

  const cidade = comunidade.cidade ? `, ${comunidade.cidade.nome}` : '';
  return {
    title: `Horários de missa – ${comunidade.nome}${cidade} | Missa Hoje`,
    description: `${comunidade.nome} (${comunidade.bairro}${cidade}): todos os horários de missa da semana, endereço e como chegar.`,
  };
}

export default async function IgrejaPage({ params }: IgrejaPageProps) {
  // Renderiza a cada requisição: a lista começa por hoje
  await connection();
  const { id, slug = [] } = await params;
  const comunidade = await getComunidade(id);
  if (!comunidade) notFound();

  // Slug ausente, antigo (igreja renomeada) ou errado: uma URL só para cada igreja
  if (slug.join('/') !== igrejaSlug(comunidade)) permanentRedirect(igrejaHref(comunidade));

  const today = localClock(new Date(), APP_TIME_ZONE).weekday;
  return <ChurchDetail comunidade={comunidade} today={today} />;
}
