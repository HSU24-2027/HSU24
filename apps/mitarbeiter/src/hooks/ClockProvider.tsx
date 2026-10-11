import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getDataSource } from '../data';
import { allowedActions, ClockState, summarizeEvents } from '../domain/time';
import type { TimeEvent, TimeEventKind } from '../domain/types';

type ClockContextValue = {
  events: TimeEvent[];
  state: ClockState;
  workedMs: number;
  breakMs: number;
  allowed: TimeEventKind[];
  busy: boolean;
  error: string | null;
  record: (kind: TimeEventKind) => Promise<void>;
  reload: () => Promise<void>;
};

const ClockContext = createContext<ClockContextValue | null>(null);

/** Gemeinsamer Stempeluhr-Zustand für "Heute" und "Zeit". */
export function ClockProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<TimeEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const reload = useCallback(async () => {
    try {
      setEvents(await getDataSource().listTodayTimeEvents());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Zeiten konnten nicht geladen werden');
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const summary = useMemo(() => summarizeEvents(events, now), [events, now]);

  useEffect(() => {
    if (summary.state === 'off') return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [summary.state]);

  const record = useCallback(async (kind: TimeEventKind) => {
    setBusy(true);
    setError(null);
    try {
      const event = await getDataSource().recordTimeEvent(kind);
      setEvents((prev) => [...prev, event]);
      setNow(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Aktion fehlgeschlagen');
    } finally {
      setBusy(false);
    }
  }, []);

  const value: ClockContextValue = {
    events,
    state: summary.state,
    workedMs: summary.workedMs,
    breakMs: summary.breakMs,
    allowed: allowedActions(summary.state),
    busy,
    error,
    record,
    reload,
  };

  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
}

export function useClock(): ClockContextValue {
  const ctx = useContext(ClockContext);
  if (!ctx) throw new Error('useClock muss innerhalb von ClockProvider verwendet werden');
  return ctx;
}

export const clockStateLabel: Record<ClockState, string> = {
  off: 'Nicht im Dienst',
  working: 'Im Dienst',
  paused: 'In Pause',
};

export const clockEventLabel: Record<TimeEventKind, string> = {
  start: 'Dienstbeginn',
  pause: 'Pause begonnen',
  resume: 'Pause beendet',
  end: 'Dienstende',
};

export const clockActionLabel: Record<TimeEventKind, string> = {
  start: 'Dienst starten',
  pause: 'Pause',
  resume: 'Fortsetzen',
  end: 'Dienst beenden',
};
