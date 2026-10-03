import { GlobeIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDayHeading, formatTime } from '@/features/missas/format';
import { weekdayName, type Weekday } from '@/features/missas/weekday';
import { externalLink, phoneHref } from '../links';
import type { Comunidade } from '../types';
import { buildWeekSchedule, type WeekScheduleDay } from '../weekSchedule';

interface ChurchDetailProps {
  comunidade: Comunidade;
  today: Weekday;
}

export function ChurchDetail({ comunidade, today }: ChurchDetailProps) {
  const { paroquia, cidade } = comunidade;
  const days = buildWeekSchedule(comunidade.horarios_missa ?? [], today);
  const directions = comunidade.link_google_maps ? externalLink(comunidade.link_google_maps) : null;

  return (
    <article aria-labelledby="igreja-titulo" className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          {paroquia && <p className="text-sm text-muted-foreground">{paroquia.nome}</p>}
          <h1 id="igreja-titulo" className="text-2xl font-semibold tracking-tight">
            {comunidade.nome}
          </h1>
        </div>
        <address className="not-italic text-muted-foreground">
          {comunidade.endereco} · {comunidade.bairro}
          {cidade && `, ${cidade.nome} – ${cidade.estado}`}
        </address>
        {directions && (
          <Button asChild className="w-fit">
            <a href={directions.href} target="_blank" rel="noopener noreferrer">
              <MapPinIcon aria-hidden />
              Como chegar
            </a>
          </Button>
        )}
      </header>

      <section aria-labelledby="horarios-titulo" className="flex flex-col gap-5">
        <h2 id="horarios-titulo" className="text-lg font-semibold">
          Horários de missa
        </h2>
        {days.length === 0 ? (
          <p className="text-muted-foreground">Ainda não há horários de missa cadastrados para esta igreja.</p>
        ) : (
          days.map((day) => <ScheduleDay key={day.weekday} day={day} />)
        )}
      </section>

      {paroquia && (paroquia.telefone || paroquia.siteOuRedeSocial) && (
        <section aria-labelledby="contato-titulo" className="flex flex-col gap-3">
          <h2 id="contato-titulo" className="text-lg font-semibold">
            Contato da paróquia
          </h2>
          <ul className="flex flex-col gap-1">
            {paroquia.telefone && (
              <ContactItem icon={<PhoneIcon aria-hidden />} href={phoneHref(paroquia.telefone)} label={paroquia.telefone} />
            )}
            {paroquia.siteOuRedeSocial && (
              <SiteItem value={paroquia.siteOuRedeSocial} />
            )}
          </ul>
        </section>
      )}
    </article>
  );
}

function dayLabel({ weekday, offset }: WeekScheduleDay): string {
  return offset <= 1 ? `${formatDayHeading(weekday, offset)} · ${weekdayName(weekday)}` : weekdayName(weekday);
}

function ScheduleDay({ day }: { day: WeekScheduleDay }) {
  const headingId = `dia-${day.weekday}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h3 id={headingId} className="text-sm font-medium text-muted-foreground">
        {dayLabel(day)}
      </h3>
      <ul className="flex flex-col gap-2">
        {day.masses.map((mass) => (
          <li key={mass.id} className="flex items-baseline gap-4 rounded-2xl bg-surface px-4 py-3">
            <time dateTime={mass.horario.slice(0, 5)} className="w-16 shrink-0 text-xl font-semibold tabular-nums">
              {formatTime(mass.horario)}
            </time>
            {mass.observacao && <span className="text-sm text-muted-foreground">{mass.observacao}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SiteItem({ value }: { value: string }) {
  const link = externalLink(value);
  return <ContactItem icon={<GlobeIcon aria-hidden />} href={link?.href ?? null} label={link?.label ?? value} external />;
}

interface ContactItemProps {
  icon: React.ReactNode;
  href: string | null;
  label: string;
  external?: boolean;
}

function ContactItem({ icon, href, label, external }: ContactItemProps) {
  const content = (
    <>
      {icon}
      {label}
    </>
  );

  return (
    <li className="flex min-h-11 items-center [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground">
      {href ? (
        <a
          href={href}
          className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
          {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {content}
        </a>
      ) : (
        <span className="inline-flex items-center gap-2">{content}</span>
      )}
    </li>
  );
}
