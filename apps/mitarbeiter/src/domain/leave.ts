import type { LeaveBalance } from './types';

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Zählt Arbeitstage (Mo–Fr) zwischen zwei Daten inklusive. Feiertage werden serverseitig geprüft. */
export function countWorkdays(fromIso: string, toIso: string): number {
  const from = parseDate(fromIso);
  const to = parseDate(toIso);
  if (to < from) return 0;
  let count = 0;
  const cursor = new Date(from);
  while (cursor <= to) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

export function remainingLeave(balance: LeaveBalance): number {
  return Math.max(0, balance.entitlement - balance.taken - balance.planned);
}

export type LeaveValidation = { ok: true; days: number } | { ok: false; reason: string };

export function validateLeaveRequest(
  fromIso: string,
  toIso: string,
  balance: LeaveBalance,
  today: Date = new Date(),
): LeaveValidation {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromIso) || !/^\d{4}-\d{2}-\d{2}$/.test(toIso)) {
    return { ok: false, reason: 'Bitte Datum im Format JJJJ-MM-TT angeben.' };
  }
  const from = parseDate(fromIso);
  const to = parseDate(toIso);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (from < startOfToday) return { ok: false, reason: 'Der Beginn liegt in der Vergangenheit.' };
  if (to < from) return { ok: false, reason: 'Das Ende liegt vor dem Beginn.' };
  const days = countWorkdays(fromIso, toIso);
  if (days === 0) return { ok: false, reason: 'Der Zeitraum enthält keine Arbeitstage.' };
  if (days > remainingLeave(balance)) {
    return { ok: false, reason: `Nicht genug Resturlaub (${remainingLeave(balance)} Tage).` };
  }
  return { ok: true, days };
}
