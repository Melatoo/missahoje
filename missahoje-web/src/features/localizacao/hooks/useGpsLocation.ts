'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cidadeProximaQuery } from '../api';
import { hrefWithCity } from '../cityHref';
import { watchPermission } from '../geolocation';
import { useLocalizacaoStore } from '../store/useLocalizacaoStore';

export function useGpsLocation() {
  const router = useRouter();
  const initialized = useLocalizacaoStore((state) => state.initialized);
  const syncPermission = useLocalizacaoStore((state) => state.syncPermission);
  const applyNearestCity = useLocalizacaoStore((state) => state.applyNearestCity);
  const failNearestCity = useLocalizacaoStore((state) => state.failNearestCity);
  const coordinates = useLocalizacaoStore((state) => state.locating?.coordinates ?? null);
  const startedAt = useLocalizacaoStore((state) => state.locating?.startedAt ?? 0);

  useEffect(() => {
    if (!initialized) return;
    return watchPermission(syncPermission);
  }, [initialized, syncPermission]);

  const nearest = useQuery(cidadeProximaQuery(coordinates));
  const failedNow = nearest.isError && nearest.errorUpdatedAt >= startedAt;

  useEffect(() => {
    if (!coordinates) return;
    if (nearest.isSuccess) {
      const cidade = nearest.data;
      if (applyNearestCity(cidade) && cidade) {
        router.replace(hrefWithCity(window.location.search, cidade.slug), { scroll: false });
      }
    } else if (failedNow) {
      failNearestCity();
    }
  }, [coordinates, nearest.isSuccess, nearest.data, failedNow, applyNearestCity, failNearestCity, router]);
}
