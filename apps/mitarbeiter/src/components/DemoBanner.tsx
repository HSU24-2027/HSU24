import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { isDemoMode } from '../config/env';
import { useTheme } from '../design/ThemeProvider';
import { AppText } from './AppText';

/** Deutlicher Hinweis, dass Beispieldaten angezeigt werden (keine echten Zeiten/Löhne). */
export function DemoBanner({ text, force }: { text?: string; force?: boolean }) {
  const t = useTheme();
  if (!isDemoMode && !force) return null;
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Demo-Modus. ${text ?? 'Beispieldaten, nichts wird gespeichert.'}`}
      style={[
        styles.banner,
        { backgroundColor: t.colors.warningSoft, borderColor: t.colors.warning },
      ]}
    >
      <Ionicons name="flask-outline" size={16} color={t.colors.warning} />
      <AppText variant="caption" style={[styles.text, { color: t.colors.warning }]}>
        <AppText variant="caption" style={{ fontFamily: 'Inter_700Bold', color: t.colors.warning }}>
          DEMO ·{' '}
        </AppText>
        {text ?? 'Beispieldaten – nichts wird gespeichert oder übertragen.'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  text: { flex: 1 },
});
