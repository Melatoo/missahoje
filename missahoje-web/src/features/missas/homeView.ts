import type { LinkCityStatus } from '@/features/localizacao/types';

export type FetchStatus = 'pending' | 'error' | 'success';

export type HomeView = 'loading' | 'no-city' | 'error' | 'empty' | 'ready';

export interface HomeViewInput {
  initialized: boolean;
  linkCity: LinkCityStatus;
  hasCity: boolean;
  locatingInBackground: boolean;
  status: FetchStatus;
  isEmpty: boolean;
}

export function resolveHomeView({
  initialized,
  linkCity,
  hasCity,
  locatingInBackground,
  status,
  isEmpty,
}: HomeViewInput): HomeView {
  if (!initialized) return 'loading';
  if (linkCity === 'error') return 'error';
  if (linkCity === 'pending') return 'loading';
  if (!hasCity) return locatingInBackground ? 'loading' : 'no-city';
  if (status === 'pending') return 'loading';
  if (status === 'error') return 'error';
  return isEmpty ? 'empty' : 'ready';
}
