export function formatarDaquiA(minutos: number): string {
  if (minutos <= 0) return 'Agora';
  if (minutos < 60) return `Daqui a ${minutos} min`;
  if (minutos < 24 * 60) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return m === 0 ? `Daqui a ${h}h` : `Daqui a ${h}h ${m}min`;
  }
  const dias = Math.floor(minutos / (24 * 60));
  return dias === 1 ? 'Daqui a 1 dia' : `Daqui a ${dias} dias`;
}
