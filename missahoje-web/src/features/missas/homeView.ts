export type HomeView = 'loading' | 'no-city' | 'error' | 'empty' | 'ready';

export interface HomeViewInput {
  initialized: boolean;
  hasCidade: boolean;
  status: 'pending' | 'error' | 'success';
  isEmpty: boolean;
}

export function resolveHomeView({ initialized, hasCidade, status, isEmpty }: HomeViewInput): HomeView {
  if (!initialized) return 'loading';
  if (!hasCidade) return 'no-city';
  if (status === 'pending') return 'loading';
  if (status === 'error') return 'error';
  return isEmpty ? 'empty' : 'ready';
}
