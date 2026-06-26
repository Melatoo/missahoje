'use client';

import { useState } from 'react';
import { HorarioMissa } from '../types';
import { getMissas } from '../lib/api';

interface MassScheduleProps {
  cidadeId?: string;
  initialMissas: HorarioMissa[];
}

type Tab = 'hoje' | 'amanha' | 'fds';

export function MassSchedule({ cidadeId, initialMissas }: MassScheduleProps) {
  const [activeTab, setActiveTab] = useState<Tab>('hoje');
  const [missas, setMissas] = useState<HorarioMissa[]>(initialMissas);
  const [loading, setLoading] = useState(false);

  const fetchMissasForTab = async (tab: Tab) => {
    setActiveTab(tab);
    setLoading(true);

    try {
      const today = new Date().getDay();
      let targets: number[] = [];
      
      if (tab === 'hoje') {
        targets = [today];
      } else if (tab === 'amanha') {
        targets = [(today + 1) % 7];
      } else if (tab === 'fds') {
        // Saturday and Sunday
        targets = [6, 0];
      }

      // Fetch all required days
      const results = await Promise.all(
        targets.map(dia => getMissas(cidadeId, dia))
      );
      
      // Combine results
      const combined = results.flatMap(r => r.items);
      
      // Sort by time
      combined.sort((a, b) => a.horario.localeCompare(b.horario));
      
      setMissas(combined);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => fetchMissasForTab('hoje')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'hoje' 
              ? 'bg-foreground text-background' 
              : 'text-foreground/70 hover:bg-black/5 border border-transparent hover:border-border/50'
          }`}
        >
          Hoje
        </button>
        <button 
          onClick={() => fetchMissasForTab('amanha')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'amanha' 
              ? 'bg-foreground text-background' 
              : 'text-foreground/70 hover:bg-black/5 border border-transparent hover:border-border/50'
          }`}
        >
          Amanhã
        </button>
        <button 
          onClick={() => fetchMissasForTab('fds')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'fds' 
              ? 'bg-foreground text-background' 
              : 'text-foreground/70 hover:bg-black/5 border border-transparent hover:border-border/50'
          }`}
        >
          Fim de Semana
        </button>
      </div>

      <div className="flex flex-col gap-0 border border-border rounded-2xl bg-surface overflow-hidden shadow-sm min-h-[200px]">
        {loading ? (
          // Skeleton loaders
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-5 border-b border-border animate-pulse">
              <div className="flex flex-col gap-2">
                <div className="h-5 w-48 bg-border rounded"></div>
                <div className="h-4 w-24 bg-border/50 rounded"></div>
              </div>
              <div className="h-8 w-16 bg-border rounded"></div>
            </div>
          ))
        ) : missas.length === 0 ? (
          <div className="p-8 text-center text-foreground/60 flex flex-col items-center justify-center h-full">
            Nenhuma missa encontrada para este período.
          </div>
        ) : (
          missas.map((missa, i) => (
            <div 
              key={missa.id || i} 
              className={`flex items-center justify-between p-5 hover:bg-black/[0.02] transition-colors cursor-pointer ${
                i !== missas.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-lg">
                  {missa.comunidade?.paroquia?.nome || missa.comunidade?.nome || 'Comunidade'}
                </span>
                <span className="text-sm text-foreground/60">
                  {missa.comunidade?.nome} {missa.comunidade?.bairro ? `- ${missa.comunidade.bairro}` : ''}
                </span>
              </div>
              <span className="font-serif text-2xl text-foreground/80">{missa.horario.substring(0, 5)}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
