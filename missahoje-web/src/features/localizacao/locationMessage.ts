import type { LocationFeedback, PermissionStatus } from './types';

const MESSAGES: Record<LocationFeedback, string> = {
  denied:
    'A localização está bloqueada para este site. Para usar, libere a localização nas configurações do navegador.',
  unavailable: 'Não conseguimos sua localização agora. Tente de novo ou escolha a cidade na lista.',
  'not-found': 'Ainda não temos horários na região onde você está. Escolha uma cidade na lista.',
  error: 'Não foi possível descobrir sua cidade agora. Confira sua conexão e tente de novo.',
};

interface LocationMessageInput {
  feedback: LocationFeedback | null;
  permissionStatus: PermissionStatus;
}

export function locationMessage({ feedback, permissionStatus }: LocationMessageInput): string | null {
  if (feedback) return MESSAGES[feedback];
  if (permissionStatus === 'denied') return MESSAGES.denied;
  return null;
}

export function canOfferLocation(geolocationAvailable: boolean, permissionStatus: PermissionStatus): boolean {
  return geolocationAvailable && permissionStatus !== 'denied';
}
