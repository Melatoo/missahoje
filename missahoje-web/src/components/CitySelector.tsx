'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cidade } from '../types';
import { getCidades } from '../lib/api';
import { setLocationCookie } from '../app/actions';

interface CitySelectorProps {
  currentCityId?: string;
  currentCityName?: string;
}

export function CitySelector({ currentCityId, currentCityName }: CitySelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (isOpen && cidades.length === 0) {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await getCidades();
          if (active) setCidades(data.items);
        } catch (e) {
          console.error(e);
        } finally {
          if (active) setLoading(false);
        }
      };
      loadData();
    }
    return () => {
      active = false;
    };
  }, [isOpen, cidades.length]);

  const handleSelect = async (cidade: Cidade) => {
    await setLocationCookie(cidade.id, cidade.nome);
    setIsOpen(false);
    router.refresh();
  };

  const displayName = currentCityName || "Selecionar Cidade";

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border/50 hover:bg-black/5 bg-surface/50 backdrop-blur-sm cursor-pointer"
      >
        <span className="text-sm">📍 {displayName}</span>
        <span className="text-xs opacity-60 uppercase tracking-widest font-semibold">Alterar</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-surface w-full max-w-md rounded-3xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border">
              <h3 className="font-serif text-2xl text-foreground font-medium">Onde você está?</h3>
              <p className="text-sm text-foreground/60 mt-1">Selecione sua cidade para ver os horários de missa.</p>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {loading ? (
                <div className="p-8 text-center text-foreground/50 text-sm">Carregando cidades...</div>
              ) : cidades.length === 0 ? (
                <div className="p-8 text-center text-foreground/50 text-sm">Nenhuma cidade encontrada.</div>
              ) : (
                <div className="flex flex-col gap-1">
                  {cidades.map((cidade) => (
                    <button
                      key={cidade.id}
                      onClick={() => handleSelect(cidade)}
                      className={`flex items-center justify-between w-full p-4 rounded-2xl transition-colors text-left ${
                        currentCityId === cidade.id 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-black/5 text-foreground'
                      }`}
                    >
                      <span className="text-lg">{cidade.nome}</span>
                      <span className="text-sm opacity-60">{cidade.estado}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-black/5 rounded-full transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
