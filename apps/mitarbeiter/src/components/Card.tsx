import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import { PressableScale } from './Pressable';

export type CardProps = ViewProps & {
  onPress?: () => void;
  padded?: boolean;
  tone?: 'default' | 'hero' | 'muted';
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Card({
  onPress,
  padded = true,
  tone = 'default',
  style,
  children,
  ...rest
}: CardProps) {
  const t = useTheme();
  const bg =
    tone === 'hero' ? t.colors.hero : tone === 'muted' ? t.colors.surfaceMuted : t.colors.surface;
  const content = [
    styles.base,
    {
      backgroundColor: bg,
      borderColor: tone === 'hero' ? 'transparent' : t.colors.border,
      borderRadius: t.radius.lg,
      padding: padded ? t.spacing.md + 2 : 0,
    },
    t.scheme === 'light' && tone !== 'muted' ? styles.shadow : null,
    style,
  ];
  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={content} {...rest}>
        {children}
      </PressableScale>
    );
  }
  return (
    <View style={content} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: StyleSheet.hairlineWidth * 2 },
  shadow: Platform.select({
    ios: {
      shadowColor: '#12243B',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 1 },
    default: { boxShadow: '0 4px 14px rgba(18,36,59,0.06)' } as ViewStyle,
  }) as ViewStyle,
});
