import type { ReactNode } from 'react';

interface HomeNoticeProps {
  children: ReactNode;
  actions?: ReactNode;
  role?: 'alert';
}

export function HomeNotice({ children, actions, role }: HomeNoticeProps) {
  return (
    <div role={role} className="flex flex-col items-start gap-4 rounded-2xl bg-surface p-5">
      <p className="text-sm text-muted-foreground">{children}</p>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
