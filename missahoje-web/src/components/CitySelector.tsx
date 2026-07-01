'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getCidades } from '../lib/api';
import { Cidade } from '../types';
import { setLocationCookie } from '../app/actions';

export function CitySelector({ currentCityId, currentCityName }: { currentCityId?: string, currentCityName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && cidades.length === 0) {
      setIsLoading(true);
      getCidades().then(data => {
        setCidades(data.items.sort((a, b) => a.nome.localeCompare(b.nome)));
      }).catch(err => {
        console.error("Erro ao carregar cidades", err);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, cidades.length]);

  const handleSelect = async (cidade: Cidade) => {
    setIsOpen(false);
    await setLocationCookie(cidade.id, cidade.nome);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel text-glow text-white px-6 py-3 rounded-full flex items-center gap-3 hover:bg-white/20 transition-all font-medium text-lg min-w-[200px] justify-between shadow-xl"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate max-w-[180px]">
            {isPending ? 'Atualizando...' : (currentCityName || 'Escolher cidade...')}
          </span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 md:right-auto md:left-0 mt-4 w-[90vw] md:w-80 glass-panel rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="p-4 border-b border-white/20">
            <h3 className="font-serif text-white font-medium text-glow text-lg">Selecione sua cidade</h3>
          </div>
          <div className="max-h-[50vh] md:max-h-80 overflow-y-auto overscroll-contain">
            {isLoading ? (
              <div className="p-8 text-center text-white/80 animate-pulse text-glow">
                Carregando cidades...
              </div>
            ) : (
              <ul className="flex flex-col">
                {cidades.map((cidade) => (
                  <li key={cidade.id}>
                    <button
                      onClick={() => handleSelect(cidade)}
                      className={`w-full text-left px-5 py-4 text-white text-glow hover:bg-white/20 transition-colors border-b border-white/10 last:border-0 ${currentCityId === cidade.id ? 'bg-primary/40 font-bold' : ''}`}
                    >
                      {cidade.nome}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
