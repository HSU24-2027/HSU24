import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import { AppText } from './AppText';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'accent';

export function Badge({
  label,
  tone = 'neutral',
  style,
}: {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const map: Record<BadgeTone, { bg: string; fg: string }> = {
    neutral: { bg: t.colors.surfaceMuted, fg: t.colors.textMuted },
    primary: { bg: t.colors.primarySoft, fg: t.colors.primary },
    success: { bg: t.colors.successSoft, fg: t.colors.success },
    warning: { bg: t.colors.warningSoft, fg: t.colors.warning },
    danger: { bg: t.colors.dangerSoft, fg: t.colors.danger },
    accent: { bg: t.colors.accentSoft, fg: t.colors.accentStrong },
  };
  const c = map[tone];
  return (
    <View
      style={[styles.badge, { backgroundColor: c.bg }, style]}
      accessible
      accessibilityLabel={label}
    >
      <AppText variant="caption" style={[styles.text, { color: c.fg }]}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' },
  text: { fontFamily: 'Inter_700Bold', fontSize: 12 },
});
