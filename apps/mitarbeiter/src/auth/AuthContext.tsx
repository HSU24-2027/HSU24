import type { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { env } from '../config/env';
import { getSupabase } from '../lib/supabase';

export type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

type AuthContextValue = {
  status: AuthStatus;
  isDemo: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  startDemo: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isDemo = env.dataMode === 'mock';
  const [status, setStatus] = useState<AuthStatus>(isDemo ? 'signedOut' : 'loading');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setStatus(data.session ? 'signedIn' : 'signedOut');
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setStatus(next ? 'signedIn' : 'signedOut');
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isDemo,
      session,
      async signIn(email, password) {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Anmeldung ist im Demo-Modus nicht verfügbar.');
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new Error('Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.');
      },
      startDemo() {
        if (isDemo) setStatus('signedIn');
      },
      async signOut() {
        const supabase = getSupabase();
        if (supabase) await supabase.auth.signOut();
        setSession(null);
        setStatus('signedOut');
      },
    }),
    [status, isDemo, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  return ctx;
}
