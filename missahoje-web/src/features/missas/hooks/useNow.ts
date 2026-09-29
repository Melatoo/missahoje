'use client';

import { useEffect, useState } from 'react';

const ONE_MINUTE = 60_000;

export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      setNow(new Date());
      timeout = setTimeout(tick, ONE_MINUTE - (Date.now() % ONE_MINUTE));
    };

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      clearTimeout(timeout);
      tick();
    };

    timeout = setTimeout(tick, ONE_MINUTE - (Date.now() % ONE_MINUTE));
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return now;
}
