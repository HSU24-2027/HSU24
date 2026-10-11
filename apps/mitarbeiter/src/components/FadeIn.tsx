import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleProp, ViewStyle } from 'react-native';

import { motion } from '../design/tokens';

const useNative = Platform.OS !== 'web';

/** Sanftes Einblenden mit leichtem Versatz; respektiert "Bewegung reduzieren". */
export function FadeIn({
  children,
  delay = 0,
  index,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  index?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(10)).current;
  const totalDelay = delay + (index ?? 0) * motion.stagger;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        const duration = reduce ? 0 : motion.normal;
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration,
            delay: reduce ? 0 : totalDelay,
            useNativeDriver: useNative,
          }),
          Animated.timing(translate, {
            toValue: 0,
            duration,
            delay: reduce ? 0 : totalDelay,
            useNativeDriver: useNative,
          }),
        ]).start();
      });
    return () => {
      cancelled = true;
    };
  }, [opacity, translate, totalDelay]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY: translate }] }]}>
      {children}
    </Animated.View>
  );
}
