import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { AppTheme, buildTheme, ColorScheme } from './tokens';

export type ThemePreference = 'system' | ColorScheme;

type ThemeContextValue = {
  theme: AppTheme;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
};

const STORAGE_KEY = 'hsu.themePreference';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function resolveScheme(
  preference: ThemePreference,
  system: ColorScheme | null | undefined,
): ColorScheme {
  if (preference === 'system') return system === 'dark' ? 'dark' : 'light';
  return preference;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === 'light' || value === 'dark' || value === 'system') {
          setPreferenceState(value);
        }
      })
      .catch(() => undefined);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const scheme = resolveScheme(preference, system as ColorScheme | null);
    return {
      theme: buildTheme(scheme),
      preference,
      setPreference: (pref) => {
        setPreferenceState(pref);
        AsyncStorage.setItem(STORAGE_KEY, pref).catch(() => undefined);
      },
    };
  }, [preference, system]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback ermöglicht isolierte Komponententests ohne Provider.
    return { theme: buildTheme('light'), preference: 'light', setPreference: () => undefined };
  }
  return ctx;
}

export function useTheme(): AppTheme {
  return useThemeContext().theme;
}
