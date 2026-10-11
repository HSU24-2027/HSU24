import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import { AppText } from './AppText';
import { Button } from './Button';
import { Card } from './Card';
import { IconCircle, IconName } from './IconCircle';

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
  action,
}: {
  icon?: IconName;
  title: string;
  message?: string;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <Card style={styles.center} accessibilityLabel={`${title}. ${message ?? ''}`}>
      <IconCircle name={icon} size={56} />
      <AppText variant="heading" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="caption" color="textMuted" align="center">
          {message}
        </AppText>
      ) : null}
      {action ? <Button label={action.label} onPress={action.onPress} variant="secondary" /> : null}
    </Card>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Card style={styles.center} accessibilityRole="alert">
      <IconCircle name="cloud-offline-outline" size={56} tone="danger" />
      <AppText variant="heading" align="center">
        Daten konnten nicht geladen werden
      </AppText>
      <AppText variant="caption" color="textMuted" align="center">
        {error.message || 'Bitte Internetverbindung prüfen und erneut versuchen.'}
      </AppText>
      {onRetry ? (
        <Button label="Erneut versuchen" icon="refresh" onPress={onRetry} variant="secondary" />
      ) : null}
    </Card>
  );
}

function SkeletonBlock({
  height,
  width = '100%',
}: {
  height: number;
  width?: number | `${number}%`;
}) {
  const t = useTheme();
  const pulse = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <Animated.View
      style={{
        height,
        width,
        borderRadius: 12,
        backgroundColor: t.colors.surfaceMuted,
        opacity: pulse,
      }}
    />
  );
}

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <View accessibilityLabel="Wird geladen" accessible style={{ gap: 12 }}>
      <SkeletonBlock height={120} />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock key={i} height={64} />
      ))}
    </View>
  );
}

/** Rendert Lade-, Fehler- oder Inhaltszustand für useAsync-Ergebnisse. */
export function QueryView<T>({
  state,
  children,
  rows,
}: {
  state: { data: T | undefined; loading: boolean; error: Error | null; reload: () => void };
  children: (data: T) => React.ReactNode;
  rows?: number;
}) {
  if (state.loading && state.data === undefined) return <LoadingState rows={rows} />;
  if (state.error && state.data === undefined)
    return <ErrorState error={state.error} onRetry={state.reload} />;
  if (state.data === undefined) return null;
  return <>{children(state.data)}</>;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: 12, paddingVertical: 32 },
});
