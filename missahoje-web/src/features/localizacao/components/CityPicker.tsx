'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronDownIcon, MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { hrefWithCity } from '@/features/missas/homeParams';
import { cidadesQuery } from '../api';
import { cidadeLabel, filterCidades } from '../cidades';
import { useCityPickerStore } from '../store/useCityPickerStore';
import { useLocalizacaoStore } from '../store/useLocalizacaoStore';
import type { CidadeSelecionada } from '../types';

export function CityPicker() {
  const router = useRouter();
  const open = useCityPickerStore((state) => state.open);
  const setOpen = useCityPickerStore((state) => state.setOpen);
  const initialized = useLocalizacaoStore((state) => state.initialized);
  const city = useLocalizacaoStore((state) => state.cidade);
  const selectCidade = useLocalizacaoStore((state) => state.selectCidade);
  const [search, setSearch] = useState('');

  const cities = useQuery({ ...cidadesQuery(), enabled: open });
  const results = cities.data ? filterCidades(cities.data, search) : [];

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch('');
  };

  const choose = (chosen: CidadeSelecionada) => {
    selectCidade(chosen, 'manual');
    changeOpen(false);
    router.replace(hrefWithCity(window.location.search, chosen.slug), { scroll: false });
  };

  const label = city ? cidadeLabel(city) : 'Escolher cidade';

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          aria-label={city ? `Cidade: ${label}. Trocar cidade` : label}
          className="-mr-3 max-w-[60%] gap-1.5 px-3 data-[pending=true]:invisible"
          data-pending={!initialized}
        >
          <MapPinIcon aria-hidden className="text-brand" />
          <span className="truncate">{label}</span>
          <ChevronDownIcon aria-hidden className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[calc(100vw-2rem)] max-w-sm p-0">
        <Command label="Escolher cidade" shouldFilter={false} loop>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Buscar cidade"
            aria-label="Buscar cidade"
          />
          <CommandList>
            {cities.isPending && (
              <p role="status" className="py-6 text-center text-sm text-muted-foreground">
                Carregando cidades…
              </p>
            )}
            {cities.isError && (
              <div role="alert" className="flex flex-col items-center gap-3 py-5 text-center text-sm text-muted-foreground">
                <p>Não foi possível carregar as cidades.</p>
                <Button variant="outline" onClick={() => void cities.refetch()}>
                  Tentar de novo
                </Button>
              </div>
            )}
            {cities.isSuccess && <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>}
            {results.length > 0 && (
              <CommandGroup>
                {results.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    data-checked={option.id === city?.id}
                    onSelect={() => choose(option)}
                    className="min-h-11"
                  >
                    {cidadeLabel(option)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
