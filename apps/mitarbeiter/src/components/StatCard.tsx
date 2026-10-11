import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { Card } from './Card';
import { IconCircle, IconName } from './IconCircle';

export function StatCard({
  icon,
  value,
  label,
  tone,
  onPress,
}: {
  icon: IconName;
  value: string;
  label: string;
  tone?: React.ComponentProps<typeof IconCircle>['tone'];
  onPress?: () => void;
}) {
  return (
    <Card style={styles.card} onPress={onPress} accessibilityLabel={`${label}: ${value}`}>
      <IconCircle name={icon} size={34} tone={tone} />
      <View style={{ marginTop: 12 }}>
        <AppText variant="metric">{value}</AppText>
        <AppText variant="caption" color="textMuted">
          {label}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({ card: { flex: 1, minWidth: 140 } });
