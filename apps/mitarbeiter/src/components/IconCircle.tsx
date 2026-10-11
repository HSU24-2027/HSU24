import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import type { ThemeColors } from '../design/tokens';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function IconCircle({
  name,
  size = 42,
  tone = 'primary',
}: {
  name: IconName;
  size?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral';
}) {
  const t = useTheme();
  const map: Record<string, [keyof ThemeColors, keyof ThemeColors]> = {
    primary: ['primarySoft', 'primary'],
    success: ['successSoft', 'success'],
    warning: ['warningSoft', 'warning'],
    danger: ['dangerSoft', 'danger'],
    accent: ['accentSoft', 'accentStrong'],
    neutral: ['surfaceMuted', 'textMuted'],
  };
  const [bg, fg] = map[tone];
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: t.colors[bg],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name} size={size * 0.5} color={t.colors[fg]} />
    </View>
  );
}
