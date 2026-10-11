import type { Shift } from './types';

export function shiftDurationMinutes(shift: Pick<Shift, 'start' | 'end' | 'breakMinutes'>): number {
  const minutes = (Date.parse(shift.end) - Date.parse(shift.start)) / 60000;
  return Math.max(0, Math.round(minutes - (shift.breakMinutes ?? 0)));
}

export function overlaps(
  a: Pick<Shift, 'start' | 'end'>,
  b: Pick<Shift, 'start' | 'end'>,
): boolean {
  return Date.parse(a.start) < Date.parse(b.end) && Date.parse(b.start) < Date.parse(a.end);
}

/** Liefert alle Paare von Schichten, die sich zeitlich überschneiden (Konfliktanzeige). */
export function findConflicts(shifts: Shift[]): [Shift, Shift][] {
  const active = shifts.filter((s) => s.status !== 'declined' && s.status !== 'cancelled');
  const sorted = [...active].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  const conflicts: [Shift, Shift][] = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (Date.parse(sorted[j].start) >= Date.parse(sorted[i].end)) break;
      if (overlaps(sorted[i], sorted[j])) conflicts.push([sorted[i], sorted[j]]);
    }
  }
  return conflicts;
}

export function conflictIds(shifts: Shift[]): Set<string> {
  const ids = new Set<string>();
  for (const [a, b] of findConflicts(shifts)) {
    ids.add(a.id);
    ids.add(b.id);
  }
  return ids;
}

export function nextShift(shifts: Shift[], now: Date = new Date()): Shift | undefined {
  return [...shifts]
    .filter((s) => Date.parse(s.end) > now.getTime())
    .filter((s) => s.status === 'confirmed' || s.status === 'offered')
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0];
}

export function localDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function groupByDay(shifts: Shift[]): { date: string; shifts: Shift[] }[] {
  const map = new Map<string, Shift[]>();
  for (const s of [...shifts].sort((a, b) => Date.parse(a.start) - Date.parse(b.start))) {
    const key = localDateKey(s.start);
    map.set(key, [...(map.get(key) ?? []), s]);
  }
  return [...map.entries()].map(([date, list]) => ({ date, shifts: list }));
}

/** Montag der Woche (lokal) für ein Datum. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = (d.getDay() + 6) % 7; // Mo=0
  d.setDate(d.getDate() - weekday);
  return d;
}

export type CalendarRange = 'day' | 'week' | 'month';

export function filterByRange(shifts: Shift[], range: CalendarRange, anchor: Date): Shift[] {
  let from: Date;
  let to: Date;
  if (range === 'day') {
    from = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
    to = new Date(from);
    to.setDate(to.getDate() + 1);
  } else if (range === 'week') {
    from = startOfWeek(anchor);
    to = new Date(from);
    to.setDate(to.getDate() + 7);
  } else {
    from = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    to = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
  }
  return shifts.filter(
    (s) => Date.parse(s.start) < to.getTime() && Date.parse(s.end) > from.getTime(),
  );
}
