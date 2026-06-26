import { HorarioMissa } from '../types';

interface NextMassCardProps {
  nextMass?: HorarioMissa;
}

export function NextMassCard({ nextMass }: NextMassCardProps) {
  if (!nextMass) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-sm uppercase tracking-widest text-foreground/60 font-semibold ml-1">
          Próxima Missa
        </h2>
        <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border flex items-center justify-center">
          <p className="text-foreground/60">Nenhuma missa agendada encontrada.</p>
        </div>
      </section>
    );
  }

  // To calculate 'Começa em X min', we would need more robust date handling, 
  // but for now we can just show the time.
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm uppercase tracking-widest text-foreground/60 font-semibold ml-1">
        Próxima Missa perto de você
      </h2>
      <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-2xl md:text-3xl text-foreground font-medium">
            {nextMass.comunidade?.paroquia?.nome || nextMass.comunidade?.nome || 'Comunidade Desconhecida'}
          </h3>
          <p className="text-foreground/70 text-sm md:text-base">
            {nextMass.comunidade?.nome} - {nextMass.comunidade?.bairro || 'Centro'}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="text-4xl font-serif text-primary font-medium">{nextMass.horario.substring(0, 5)}</div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/20">
            Hoje
          </div>
        </div>
      </div>
    </section>
  );
}
