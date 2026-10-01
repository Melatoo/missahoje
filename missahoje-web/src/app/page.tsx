import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { HomeScreen } from '@/features/missas/components/HomeScreen';
import { MassListSkeleton } from '@/features/missas/components/MassListSkeleton';

function HomeFallback() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-8 w-48" />
      <MassListSkeleton />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeScreen />
    </Suspense>
  );
}
