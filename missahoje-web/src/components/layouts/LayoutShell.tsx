import React from 'react';
import Link from 'next/link';
import { Wordmark } from '../Wordmark';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-xl items-center px-gutter">
          <Link href="/" className="inline-flex min-h-11 items-center text-brand">
            <Wordmark className="h-5 w-auto" />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-gutter pt-6 pb-10">
        {children}
      </main>
    </div>
  );
}
