'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { cidadesQuery } from '../api';
import { useLocalizacaoStore } from '../store/useLocalizacaoStore';

export interface LinkCityResult {
  status: 'pending' | 'error' | null;
  retry: () => void;
}

export function useLinkCity(): LinkCityResult {
  const pending = useLocalizacaoStore(
    (state) => state.initialized && Boolean(state.link?.cidadeSlug) && state.cidade === null,
  );
  const resolveLink = useLocalizacaoStore((state) => state.resolveLink);
  const query = useQuery({ ...cidadesQuery(), enabled: pending });

  useEffect(() => {
    if (pending && query.data) resolveLink(query.data);
  }, [pending, query.data, resolveLink]);

  const retry = () => void query.refetch();
  if (!pending) return { status: null, retry };
  return { status: query.isError ? 'error' : 'pending', retry };
}
