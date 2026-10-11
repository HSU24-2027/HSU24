import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import { minTouchTarget } from '../design/tokens';
import { AppText } from './AppText';
import { PressableScale } from './Pressable';

export type ButtonVariant =
  'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse' | 'inverseOutline';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  testID?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  fullWidth,
  size = 'md',
  style,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const t = useTheme();
  const palette: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
    primary: { bg: t.colors.primary, fg: t.colors.onPrimary, border: t.colors.primary },
    secondary: { bg: t.colors.primarySoft, fg: t.colors.primary, border: t.colors.primarySoft },
    ghost: { bg: 'transparent', fg: t.colors.primary, border: t.colors.border },
    danger: { bg: t.colors.dangerSoft, fg: t.colors.danger, border: t.colors.dangerSoft },
    inverse: { bg: '#FFFFFF', fg: '#12243B', border: '#FFFFFF' },
    inverseOutline: {
      bg: 'rgba(255,255,255,0.08)',
      fg: '#FFFFFF',
      border: 'rgba(255,255,255,0.35)',
    },
  };
  const c = palette[variant];
  return (
    <PressableScale
      testID={testID}
      haptic
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={[
        styles.base,
        {
          backgroundColor: c.bg,
          borderColor: c.border,
          borderRadius: t.radius.sm + 2,
          minHeight: size === 'lg' ? 54 : minTouchTarget + 2,
        },
        fullWidth ? styles.full : styles.auto,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={c.fg} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={18} color={c.fg} /> : null}
            <AppText variant="bodyStrong" style={{ color: c.fg }}>
              {label}
            </AppText>
          </>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, paddingHorizontal: 18, justifyContent: 'center' },
  full: { alignSelf: 'stretch' },
  auto: { alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
