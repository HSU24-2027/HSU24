import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { env } from '../config/env';
import { secureSessionStorage } from './secureStorage';

let client: SupabaseClient | null = null;

/**
 * Liefert den Supabase-Client oder null im Demo-Modus.
 * Es wird ausschließlich der öffentliche anon-Key verwendet; Berechtigungen
 * werden serverseitig über Row Level Security (supabase/schema.sql) erzwungen.
 */
export function getSupabase(): SupabaseClient | null {
  if (env.dataMode !== 'supabase') return null;
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: secureSessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    if (Platform.OS !== 'web') {
      // Token-Refresh nur im Vordergrund (Empfehlung von Supabase für React Native).
      AppState.addEventListener('change', (state) => {
        if (!client) return;
        if (state === 'active') client.auth.startAutoRefresh();
        else client.auth.stopAutoRefresh();
      });
    }
  }
  return client;
}
