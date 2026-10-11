import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { PressableScale } from './Pressable';

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; onPress: () => void };
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="heading">{title}</AppText>
        {action ? (
          <PressableScale
            onPress={action.onPress}
            accessibilityLabel={action.label}
            style={styles.action}
          >
            <AppText variant="caption" color="primary" style={{ fontFamily: 'Inter_700Bold' }}>
              {action.label}
            </AppText>
          </PressableScale>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 22 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  action: { minHeight: 32, justifyContent: 'center', paddingHorizontal: 4 },
});
