import { Skeleton } from '@/components/ui/skeleton';

export function MassListSkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-3">
      <span className="sr-only">Carregando os horários…</span>
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 rounded-2xl" />
      ))}
    </div>
  );
}
