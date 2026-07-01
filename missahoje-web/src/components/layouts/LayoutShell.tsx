import React from 'react';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative font-sans">
      {/* Mobile Header / Desktop Sidebar */}
      <aside className="w-full md:w-80 bg-background/80 backdrop-blur-md border-b md:border-b-0 md:border-r border-white/20 p-6 flex flex-col z-20">
        <h1 className="font-title text-4xl text-primary font-medium tracking-tight">
          MissaHoje
        </h1>
        <p className="text-sm text-foreground/70 mt-2 font-serif">Encontre missas perto de você</p>
        
        {/* Placeholder for future sidebar content (filters, search) */}
        <div className="mt-8 flex-1">
        </div>
      </aside>

      {/* Main Content Area (Map + Overlays) */}
      <main className="flex-1 relative z-10 bg-transparent">
        {children}
      </main>
    </div>
  );
}
