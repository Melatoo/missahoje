import { timeToMinutes } from './clock';
import type { Schedule } from './schedule';
import { formatTimeUntil } from './timeUntil';
import { weekdayName, type Weekday } from './weekday';

export function formatTime(time: string): string {
  const minutes = timeToMinutes(time);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

export function formatDayName(weekday: Weekday): string {
  return weekdayName(weekday).toLowerCase();
}

export function formatDayWithArticle(weekday: Weekday): string {
  const article = weekday === 0 || weekday === 6 ? 'no' : 'na';
  return `${article} ${formatDayName(weekday)}`;
}

export function formatDayHeading(weekday: Weekday, offset: number): string {
  if (offset === 0) return 'Hoje';
  if (offset === 1) return 'Amanhã';
  if (offset === 7) return `${weekdayName(weekday)} que vem`;
  return weekdayName(weekday);
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
}

export function describeNextMasses(schedule: Schedule): string | null {
  const [first] = schedule.next;
  const day = schedule.days[schedule.days.length - 1];
  if (!first || !day || schedule.minutesUntilNext === null) return null;

  const label = schedule.next.length > 1 ? 'Próximas missas' : 'Próxima missa';
  const when = `${formatDayHeading(day.weekday, day.offset).toLowerCase()} às ${formatTime(first.horario)}`;
  const where = joinNames(schedule.next.map((m) => m.comunidade.nome));
  const timeUntil = formatTimeUntil(schedule.minutesUntilNext);

  return `${label}: ${when}${where ? `, em ${where}` : ''}, ${timeUntil.charAt(0).toLowerCase()}${timeUntil.slice(1)}.`;
}
