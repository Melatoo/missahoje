import { getLocationCookie } from './actions';
import { getMissas } from '../lib/api';
import { CitySelector } from '../components/CitySelector';
import { NextMassCard } from '../components/NextMassCard';
import { MassSchedule } from '../components/MassSchedule';
import { HorarioMissa } from '../types';

export default async function Home() {
  const { cidadeId, cidadeNome } = await getLocationCookie();
  
  // Fetch initial missas (Today)
  const today = new Date().getDay();
  let initialMissas: HorarioMissa[] = [];
  
  if (cidadeId) {
    try {
      const response = await getMissas(cidadeId, today);
      initialMissas = response.items.sort((a, b) => a.horario.localeCompare(b.horario));
    } catch (error) {
      console.error('Failed to fetch initial missas:', error);
    }
  }

  // Calculate Next Mass
  const now = new Date();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
  const nextMass = initialMissas.find(m => m.horario > currentTimeStr);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans">
      {/* Elemento Assinatura: Efeito Vitral (Stained Glass Ambient Light) */}
      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] opacity-30 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--color-primary) 0%, var(--color-secondary) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulse-slow 8s infinite alternate ease-in-out'
        }}
      />

      <header className="w-full max-w-2xl mx-auto px-6 pt-12 pb-8 flex flex-col items-center justify-center relative z-10">
        <h1 className="font-serif text-5xl md:text-6xl text-foreground font-medium tracking-tight mb-2">
          Missa Hoje
        </h1>
        <CitySelector currentCityId={cidadeId} currentCityName={cidadeNome} />
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pb-24 flex flex-col gap-8 relative z-10">
        {!cidadeId ? (
          <div className="bg-surface rounded-2xl p-8 text-center shadow-sm border border-border mt-8">
            <h2 className="font-serif text-2xl mb-2 text-foreground">Bem-vindo ao Missa Hoje</h2>
            <p className="text-foreground/70">
              Por favor, selecione sua cidade no botão acima para visualizar os horários de missa mais próximos a você.
            </p>
          </div>
        ) : (
          <>
            <NextMassCard nextMass={nextMass} />
            <MassSchedule cidadeId={cidadeId} initialMissas={initialMissas} />
          </>
        )}
      </main>

      {/* Style for animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-slow {
          0% { transform: scale(1) translate(0, 0); opacity: 0.2; }
          100% { transform: scale(1.05) translate(2%, 2%); opacity: 0.4; }
        }
      `}} />
    </div>
  );
}
