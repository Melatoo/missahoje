export function formatTimeUntil(minutes: number): string {
  if (minutes <= 0) return 'Agora';
  if (minutes < 60) return `Daqui a ${minutes} min`;
  if (minutes < 24 * 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `Daqui a ${h}h` : `Daqui a ${h}h ${m}min`;
  }
  const days = Math.floor(minutes / (24 * 60));
  return days === 1 ? 'Daqui a 1 dia' : `Daqui a ${days} dias`;
}
