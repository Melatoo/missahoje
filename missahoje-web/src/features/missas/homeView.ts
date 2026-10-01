export type FetchStatus = 'pending' | 'error' | 'success';

export type HomeView = 'loading' | 'no-city' | 'error' | 'empty' | 'ready';

export interface HomeViewInput {
  initialized: boolean;
  linkCity: Exclude<FetchStatus, 'success'> | null;
  hasCity: boolean;
  status: FetchStatus;
  isEmpty: boolean;
}

export function resolveHomeView({ initialized, linkCity, hasCity, status, isEmpty }: HomeViewInput): HomeView {
  if (!initialized) return 'loading';
  if (linkCity === 'error') return 'error';
  if (linkCity === 'pending') return 'loading';
  if (!hasCity) return 'no-city';
  if (status === 'pending') return 'loading';
  if (status === 'error') return 'error';
  return isEmpty ? 'empty' : 'ready';
}
