'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getMissas } from '../lib/api';
import { HorarioMissa } from '../types';

export function MassSchedule({ cidadeId, initialMissas }: { cidadeId: string, initialMissas: HorarioMissa[] }) {
  const [missas, setMissas] = useState<HorarioMissa[]>(initialMissas);
  const [activeDay, setActiveDay] = useState(new Date().getDay());
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const diasAbreviados = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const fetchMissas = async (dia: number) => {
    setActiveDay(dia);
    setIsLoading(true);
    try {
      const response = await getMissas(cidadeId, dia);
      setMissas(response.items.sort((a, b) => a.horario.localeCompare(b.horario)));
    } catch (error) {
      console.error('Erro ao buscar missas', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Selector de Dias */}
      <div className="glass-panel rounded-full p-2 flex overflow-x-auto snap-x hide-scrollbar">
        {diasAbreviados.map((dia, index) => (
          <button
            key={index}
            onClick={() => fetchMissas(index)}
            className={`flex-1 min-w-[80px] snap-center py-3 rounded-full font-medium transition-colors text-white text-glow text-lg ${
              activeDay === index 
                ? 'bg-primary/50 border border-white/40 shadow-lg' 
                : 'hover:bg-white/10'
            }`}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Lista de Missas */}
      <div className="glass-panel rounded-[2rem] p-4 md:p-8 flex-1 overflow-y-auto min-h-[400px]">
        <h3 className="font-serif text-3xl text-white font-medium mb-6 text-glow px-4">
          Horários de {dias[activeDay]}
        </h3>
        
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
            ))}
          </div>
        ) : missas.length > 0 ? (
          <div className="flex flex-col gap-4">
            {missas.map((missa) => (
              <div 
                key={missa.id} 
                className="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-6 flex items-center justify-between border border-white/10"
              >
                <div className="flex-1 pr-4">
                  <h4 className="text-xl md:text-2xl text-white font-bold mb-1 text-glow">{missa.paroquia.nome}</h4>
                  <p className="text-white/80 text-md md:text-lg text-glow line-clamp-1">{missa.paroquia.bairro}</p>
                </div>
                <div className="text-3xl md:text-4xl text-white font-serif font-bold text-glow">
                  {formatTime(missa.horario)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center p-8">
            <span className="text-5xl mb-4 opacity-70">🕊️</span>
            <p className="text-white/90 text-lg md:text-xl text-glow max-w-sm">
              Não temos missas cadastradas para {dias[activeDay].toLowerCase()} nesta cidade.
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
