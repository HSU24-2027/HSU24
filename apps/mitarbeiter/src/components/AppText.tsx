import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import type { ThemeColors, TypographyVariant } from '../design/tokens';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: keyof ThemeColors;
  align?: TextStyle['textAlign'];
};

export function AppText({ variant = 'body', color = 'text', align, style, ...rest }: AppTextProps) {
  const t = useTheme();
  const accessibilityRole =
    variant === 'display' || variant === 'title' || variant === 'heading' ? 'header' : undefined;
  return (
    <Text
      accessibilityRole={accessibilityRole}
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[
        t.typography[variant] as TextStyle,
        { color: t.colors[color] },
        align ? { textAlign: align } : null,
        variant === 'label' ? styles.upper : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({ upper: { textTransform: 'uppercase' } });
