import React from 'react';
import { Wordmark } from '../Wordmark';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative font-sans">
      <aside className="w-full md:w-80 bg-background border-b md:border-b-0 md:border-r p-gutter flex flex-col z-20">
        <h1 className="text-brand">
          <Wordmark className="h-7 w-auto" />
        </h1>
        <p className="text-sm text-muted-foreground mt-2 font-serif">Encontre missas perto de você</p>

        <div className="mt-8 flex-1">
        </div>
      </aside>

      <main className="flex-1 relative z-10 bg-transparent">
        {children}
      </main>
    </div>
  );
}
