import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable as RNPressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
  scaleTo?: number;
};

const useNative = Platform.OS !== 'web';

const OUTER_KEYS = [
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'width',
  'minWidth',
  'maxWidth',
  'alignSelf',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'position',
  'top',
  'left',
  'right',
  'bottom',
] as const;

/** Trennt Layout-Stile (für den äußeren Pressable) von Optik-Stilen (für die animierte Ansicht). */
export function splitLayoutStyle(style: StyleProp<ViewStyle>): {
  outer: ViewStyle;
  inner: ViewStyle;
} {
  const flat = { ...(StyleSheet.flatten(style) ?? {}) } as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  for (const key of OUTER_KEYS) {
    if (flat[key] !== undefined) {
      outer[key] = flat[key];
      delete flat[key];
    }
  }
  if (outer.flex !== undefined || outer.flexGrow !== undefined) flat.flexGrow = 1;
  return { outer: outer as ViewStyle, inner: flat as ViewStyle };
}

export function triggerHaptic() {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => undefined);
}

/** Pressable mit sanfter Skalierungsanimation und optionalem haptischen Feedback. */
export function PressableScale({
  style,
  haptic = false,
  scaleTo = 0.97,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  children,
  ...rest
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const { outer, inner } = splitLayoutStyle(style);
  const animate = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: useNative,
      speed: 40,
      bounciness: 0,
    }).start();

  return (
    <RNPressable
      accessibilityRole="button"
      disabled={disabled}
      style={outer}
      onPressIn={(e) => {
        animate(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animate(1);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) triggerHaptic();
        onPress?.(e);
      }}
      {...rest}
    >
      {(state) => (
        <Animated.View
          style={[inner, { transform: [{ scale }] }, disabled ? { opacity: 0.5 } : null]}
        >
          {typeof children === 'function' ? children(state) : children}
        </Animated.View>
      )}
    </RNPressable>
  );
}
