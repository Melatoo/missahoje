import { HorarioMissa } from '../types';

export function NextMassCard({ nextMass }: { nextMass?: HorarioMissa }) {
  if (!nextMass) {
    return null;
  }

  // Helper to get time without seconds
  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  return (
    <div className="glass-panel p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] w-full relative overflow-hidden flex flex-col justify-between min-h-[300px]">
      
      {/* Glow Effect / Overlay decorativo sutil por trás do vidro */}
      <div className="absolute top-0 right-0 w-full h-full bg-primary/20 mix-blend-overlay pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-secondary/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg">
            Próxima Missa
          </span>
        </div>
        
        <h2 className="font-serif text-7xl md:text-8xl text-white font-medium tracking-tight mb-2 text-glow">
          {formatTime(nextMass.horario)}
        </h2>
        
        <div className="mt-8">
          <h3 className="text-2xl md:text-3xl text-white font-bold mb-2 text-glow">
            {nextMass.paroquia.nome}
          </h3>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-md leading-relaxed text-glow">
            {nextMass.paroquia.endereco}
            <br />
            {nextMass.paroquia.bairro}
          </p>
        </div>
      </div>
      
      {/* Botão de Rota */}
      <div className="relative z-10 mt-10 md:mt-12 flex justify-end">
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextMass.paroquia.nome + ' ' + nextMass.paroquia.endereco)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-colors border border-white/30 shadow-xl text-glow w-full md:w-auto justify-center text-lg md:text-xl h-16"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Como chegar
        </a>
      </div>
    </div>
  );
}
