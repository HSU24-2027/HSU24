import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import { AppText } from './AppText';

export function TextField({
  label,
  error,
  hint,
  style,
  ...rest
}: TextInputProps & { label: string; error?: string; hint?: string }) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <AppText variant="caption" style={{ fontFamily: 'Inter_700Bold', marginBottom: 6 }}>
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        placeholderTextColor={t.colors.textSubtle}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
        style={[
          styles.input,
          {
            color: t.colors.text,
            backgroundColor: t.colors.surface,
            borderColor: error ? t.colors.danger : focused ? t.colors.primary : t.colors.border,
            borderRadius: t.radius.sm + 2,
          },
          style,
        ]}
      />
      {error ? (
        <AppText
          variant="caption"
          color="danger"
          style={{ marginTop: 4 }}
          accessibilityRole="alert"
        >
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color="textMuted" style={{ marginTop: 4 }}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  input: { borderWidth: 1.5, minHeight: 48, paddingHorizontal: 14, fontSize: 16 },
});
