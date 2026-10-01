'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cidadesQuery } from '../api';
import { hrefWithoutCity } from '../cityHref';
import { useLocalizacaoStore } from '../store/useLocalizacaoStore';
import type { LinkCityStatus } from '../types';

export interface LinkCityResult {
  status: LinkCityStatus;
  retry: () => void;
}

export function useResolveLinkCity(): LinkCityResult {
  const router = useRouter();
  const pending = useLocalizacaoStore(
    (state) => state.initialized && Boolean(state.link?.cidadeSlug) && state.cidade === null,
  );
  const resolveLink = useLocalizacaoStore((state) => state.resolveLink);
  const abandonLink = useLocalizacaoStore((state) => state.abandonLink);
  const query = useQuery({ ...cidadesQuery(), enabled: pending });

  useEffect(() => {
    if (!pending || (!query.data && !query.isError)) return;
    if (query.data) resolveLink(query.data);
    else abandonLink();
    if (!useLocalizacaoStore.getState().link) {
      router.replace(hrefWithoutCity(window.location.search), { scroll: false });
    }
  }, [pending, query.data, query.isError, resolveLink, abandonLink, router]);

  const retry = () => void query.refetch();
  if (!pending) return { status: null, retry };
  return { status: query.isError ? 'error' : 'pending', retry };
}
