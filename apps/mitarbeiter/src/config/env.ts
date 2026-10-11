/**
 * Zentrale, typisierte Laufzeitkonfiguration.
 * Nur EXPO_PUBLIC_*-Variablen sind im Client verfügbar – sie sind öffentlich.
 * Niemals Service-Role-Keys oder andere Geheimnisse verwenden.
 */
export type DataMode = 'mock' | 'supabase';

export type AppEnv = {
  dataMode: DataMode;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isSupabaseConfigured: boolean;
};

export function readEnv(source: Record<string, string | undefined> = process.env): AppEnv {
  const supabaseUrl = source.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = source.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const isSupabaseConfigured =
    /^https:\/\/.+/.test(supabaseUrl) &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('your-project-ref');
  const requested = source.EXPO_PUBLIC_DATA_MODE === 'supabase' ? 'supabase' : 'mock';
  // Fällt sicher auf Demo-Modus zurück, wenn Supabase nicht vollständig konfiguriert ist.
  const dataMode: DataMode = requested === 'supabase' && isSupabaseConfigured ? 'supabase' : 'mock';
  return { dataMode, supabaseUrl, supabaseAnonKey, isSupabaseConfigured };
}

// Expo ersetzt process.env.EXPO_PUBLIC_* zur Build-Zeit nur bei direktem Zugriff.
export const env: AppEnv = readEnv({
  EXPO_PUBLIC_DATA_MODE: process.env.EXPO_PUBLIC_DATA_MODE,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

export const isDemoMode = env.dataMode === 'mock';
