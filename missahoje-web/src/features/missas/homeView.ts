export type FetchStatus = 'pending' | 'error' | 'success';

export type HomeView = 'loading' | 'no-city' | 'error' | 'empty' | 'ready';

export interface HomeViewInput {
  initialized: boolean;
  hasCity: boolean;
  status: FetchStatus;
  isEmpty: boolean;
}

export function resolveHomeView({ initialized, hasCity, status, isEmpty }: HomeViewInput): HomeView {
  if (!initialized) return 'loading';
  if (!hasCity) return 'no-city';
  if (status === 'pending') return 'loading';
  if (status === 'error') return 'error';
  return isEmpty ? 'empty' : 'ready';
}
