import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import { AppText } from './AppText';
import { PressableScale } from './Pressable';

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}) {
  const t = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.wrap,
        { backgroundColor: t.colors.surfaceMuted, borderRadius: t.radius.sm + 2 },
      ]}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <PressableScale
            key={o.value}
            haptic
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={o.label}
            onPress={() => onChange(o.value)}
            style={[
              styles.item,
              { borderRadius: t.radius.sm },
              active ? { backgroundColor: t.colors.surface } : null,
            ]}
          >
            <AppText
              variant="caption"
              align="center"
              style={{
                fontFamily: active ? 'Inter_700Bold' : 'Inter_500Medium',
                color: active ? t.colors.text : t.colors.textMuted,
              }}
            >
              {o.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', padding: 4, gap: 4, marginBottom: 16 },
  item: { flex: 1, minHeight: 36, justifyContent: 'center', paddingHorizontal: 8 },
});
