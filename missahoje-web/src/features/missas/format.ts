import type { Agenda } from './agenda';
import { formatarDaquiA } from './daquiA';
import { horarioEmMinutos } from './relogio';

const DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function formatHorario(horario: string): string {
  const minutos = horarioEmMinutos(horario);
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

export function formatDayName(diaSemana: number): string {
  return DIAS[diaSemana].toLowerCase();
}

export function formatDayWithArticle(diaSemana: number): string {
  const artigo = diaSemana === 0 || diaSemana === 6 ? 'no' : 'na';
  return `${artigo} ${formatDayName(diaSemana)}`;
}

export function formatDayHeading(diaSemana: number, deslocamento: number): string {
  if (deslocamento === 0) return 'Hoje';
  if (deslocamento === 1) return 'Amanhã';
  if (deslocamento === 7) return `${DIAS[diaSemana]} que vem`;
  return DIAS[diaSemana];
}

function joinNames(nomes: string[]): string {
  if (nomes.length <= 1) return nomes.join('');
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}

export function describeNextMasses(agenda: Agenda): string | null {
  const [primeira] = agenda.proximas;
  const dia = agenda.dias[agenda.dias.length - 1];
  if (!primeira || !dia || agenda.minutosAteProxima === null) return null;

  const rotulo = agenda.proximas.length > 1 ? 'Próximas missas' : 'Próxima missa';
  const quando = `${formatDayHeading(dia.diaSemana, dia.deslocamento).toLowerCase()} às ${formatHorario(primeira.horario)}`;
  const onde = joinNames(agenda.proximas.map((m) => m.comunidade?.nome ?? '').filter(Boolean));
  const daquiA = formatarDaquiA(agenda.minutosAteProxima);

  return `${rotulo}: ${quando}${onde ? `, em ${onde}` : ''}, ${daquiA.charAt(0).toLowerCase()}${daquiA.slice(1)}.`;
}
