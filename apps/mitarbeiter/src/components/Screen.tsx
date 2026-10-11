import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../design/ThemeProvider';
import { AppText } from './AppText';
import { DemoBanner } from './DemoBanner';

export type ScreenProps = {
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  demoNote?: string | false;
  headerRight?: React.ReactNode;
  /** true, wenn ein nativer Stack-Header sichtbar ist (kein eigener oberer Abstand). */
  withNativeHeader?: boolean;
  testID?: string;
};

export function Screen({
  title,
  eyebrow,
  subtitle,
  children,
  onRefresh,
  refreshing = false,
  demoNote,
  headerRight,
  withNativeHeader,
  testID,
}: ScreenProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      testID={testID}
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: withNativeHeader ? t.spacing.md : insets.top + t.spacing.md },
      ]}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={t.colors.primary}
          />
        ) : undefined
      }
    >
      <View style={styles.inner}>
        {title ? (
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              {eyebrow ? (
                <AppText variant="label" color="primary" style={{ marginBottom: 6 }}>
                  {eyebrow}
                </AppText>
              ) : null}
              <AppText variant="display">{title}</AppText>
              {subtitle ? (
                <AppText color="textMuted" style={{ marginTop: 4 }}>
                  {subtitle}
                </AppText>
              ) : null}
            </View>
            {headerRight}
          </View>
        ) : null}
        {demoNote !== false ? <DemoBanner text={demoNote} /> : null}
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 110 },
  inner: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 18, gap: 12 },
});
