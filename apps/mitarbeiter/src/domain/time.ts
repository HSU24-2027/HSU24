import type { TimeEvent, TimeEventKind } from './types';

export type ClockState = 'off' | 'working' | 'paused';

/** Erlaubte Übergänge der Stempeluhr (Zustandsautomat). */
const TRANSITIONS: Record<ClockState, Partial<Record<TimeEventKind, ClockState>>> = {
  off: { start: 'working' },
  working: { pause: 'paused', end: 'off' },
  paused: { resume: 'working', end: 'off' },
};

export function nextClockState(state: ClockState, kind: TimeEventKind): ClockState | null {
  return TRANSITIONS[state][kind] ?? null;
}

export function allowedActions(state: ClockState): TimeEventKind[] {
  return Object.keys(TRANSITIONS[state]) as TimeEventKind[];
}

/** Ermittelt den aktuellen Zustand aus einer chronologischen Ereignisliste. */
export function deriveClockState(events: TimeEvent[]): ClockState {
  let state: ClockState = 'off';
  for (const event of sortEvents(events)) {
    const next = nextClockState(state, event.kind);
    if (next === null) {
      throw new Error(`Ungültiger Zeitstempel-Übergang: ${state} -> ${event.kind}`);
    }
    state = next;
  }
  return state;
}

function sortEvents(events: TimeEvent[]): TimeEvent[] {
  return [...events].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

export type WorkSummary = { workedMs: number; breakMs: number; state: ClockState };

/**
 * Berechnet Arbeits- und Pausenzeit aus Ereignissen.
 * Ist die Schicht noch offen, wird bis `now` gerechnet.
 */
export function summarizeEvents(events: TimeEvent[], now: Date = new Date()): WorkSummary {
  const sorted = sortEvents(events);
  let state: ClockState = 'off';
  let workedMs = 0;
  let breakMs = 0;
  let lastAt: number | null = null;

  for (const event of sorted) {
    const at = Date.parse(event.at);
    if (lastAt !== null) {
      const delta = Math.max(0, at - lastAt);
      if (state === 'working') workedMs += delta;
      if (state === 'paused') breakMs += delta;
    }
    const next = nextClockState(state, event.kind);
    if (next === null) {
      throw new Error(`Ungültiger Zeitstempel-Übergang: ${state} -> ${event.kind}`);
    }
    state = next;
    lastAt = at;
  }

  if (lastAt !== null && state !== 'off') {
    const delta = Math.max(0, now.getTime() - lastAt);
    if (state === 'working') workedMs += delta;
    if (state === 'paused') breakMs += delta;
  }

  return { workedMs, breakMs, state };
}

/**
 * Gesetzliche Mindestpause nach § 4 ArbZG:
 * > 6 h Arbeitszeit → 30 min, > 9 h → 45 min.
 */
export function requiredBreakMinutes(workedMinutes: number): number {
  if (workedMinutes > 9 * 60) return 45;
  if (workedMinutes > 6 * 60) return 30;
  return 0;
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${m.toString().padStart(2, '0')} h`;
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
}

export function minutesToHours(minutes: number): string {
  const value = Math.round((minutes / 60) * 10) / 10;
  return value.toString().replace('.', ',');
}
