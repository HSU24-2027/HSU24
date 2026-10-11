import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useTheme } from '../design/ThemeProvider';

export function ProgressBar({
  value,
  tone = 'primary',
  height = 8,
  label,
}: {
  value: number;
  tone?: 'primary' | 'success' | 'inverse';
  height?: number;
  label?: string;
}) {
  const t = useTheme();
  const clamped = Math.max(0, Math.min(100, value));
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: clamped,
      duration: t.motion.slow,
      useNativeDriver: false,
    }).start();
  }, [anim, clamped, t.motion.slow]);
  const fill =
    tone === 'success' ? t.colors.success : tone === 'inverse' ? '#FFFFFF' : t.colors.primary;
  const track = tone === 'inverse' ? 'rgba(255,255,255,0.18)' : t.colors.surfaceMuted;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      style={[styles.track, { height, borderRadius: height, backgroundColor: track }]}
    >
      <Animated.View
        style={{
          height,
          borderRadius: height,
          backgroundColor: fill,
          width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({ track: { overflow: 'hidden', width: '100%' } });
