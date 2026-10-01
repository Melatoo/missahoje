'use client';

import { Loader2Icon, LocateFixedIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { canOfferLocation } from '../locationMessage';
import { useLocalizacaoStore } from '../store/useLocalizacaoStore';

interface UseLocationButtonProps {
  variant?: 'default' | 'outline' | 'link';
  className?: string;
}

export function UseLocationButton({ variant = 'default', className }: UseLocationButtonProps) {
  const available = useLocalizacaoStore((state) => canOfferLocation(state.geolocationAvailable, state.permissionStatus));
  const locating = useLocalizacaoStore((state) => state.locating);
  const requestPosition = useLocalizacaoStore((state) => state.requestPosition);

  if (!available) return null;

  const busy = Boolean(locating?.explicit);

  return (
    <Button
      variant={variant}
      className={className}
      disabled={locating !== null}
      aria-busy={busy}
      onClick={() => void requestPosition()}
    >
      {busy ? <Loader2Icon aria-hidden className="animate-spin" /> : <LocateFixedIcon aria-hidden />}
      {busy ? 'Buscando sua localização…' : 'Usar minha localização exata'}
    </Button>
  );
}
