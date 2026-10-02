'use client';

import { locationMessage } from '../locationMessage';
import { useLocalizacaoStore } from '../store/useLocalizacaoStore';

export function LocationStatus() {
  const message = useLocalizacaoStore((state) =>
    locationMessage({ feedback: state.locationFeedback, permissionStatus: state.permissionStatus }),
  );

  return (
    <p role="status" className="text-sm text-muted-foreground empty:hidden">
      {message}
    </p>
  );
}
