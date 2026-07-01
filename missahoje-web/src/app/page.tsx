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
    <div className="min-h-screen flex flex-col relative font-sans selection:bg-primary/30">
      
      <header className="w-full mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
        <h1 className="font-serif text-5xl md:text-6xl text-white font-medium tracking-tight text-glow">
          Missa Hoje
        </h1>
        <CitySelector currentCityId={cidadeId} currentCityName={cidadeNome} />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 flex flex-col relative z-10">
        {!cidadeId ? (
          <div className="glass-panel rounded-[3rem] p-12 md:p-20 text-center mt-8 md:mt-16 flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto w-full">
            <div className="text-8xl md:text-9xl mb-2 opacity-90 drop-shadow-2xl">🕊️</div>
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white font-medium leading-tight text-glow">Onde você está?</h2>
              <p className="text-white/90 text-lg md:text-xl max-w-md mx-auto leading-relaxed text-glow">
                Por favor, selecione sua cidade no botão acima para descobrirmos os horários e paróquias mais próximas de você.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 md:gap-12 w-full mt-6">
            <NextMassCard nextMass={nextMass} />
            <MassSchedule cidadeId={cidadeId} initialMissas={initialMissas} />
          </div>
        )}
      </main>

    </div>
  );
}
