import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import { shiftStatusLabel } from '../domain/labels';
import { shiftDurationMinutes } from '../domain/shifts';
import { minutesToHours } from '../domain/time';
import type { Shift } from '../domain/types';
import { formatDate, formatTimeRange } from '../lib/format';
import { AppText } from './AppText';
import { Badge } from './Badge';
import { Card } from './Card';

export function ShiftCard({
  shift,
  conflict,
  compact,
}: {
  shift: Shift;
  conflict: boolean;
  compact?: boolean;
}) {
  const t = useTheme();
  const status = shiftStatusLabel[shift.status];
  return (
    <Card
      onPress={() => router.push(`/einsatz/${shift.id}`)}
      accessibilityLabel={`${shift.title}, ${formatTimeRange(shift.start, shift.end)}, ${status.label}`}
      style={[styles.card, conflict ? { borderColor: t.colors.warning, borderWidth: 1.5 } : null]}
    >
      <View
        style={[
          styles.accent,
          { backgroundColor: shift.status === 'offered' ? t.colors.accent : t.colors.primary },
        ]}
      />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={styles.row}>
          <AppText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
            {shift.title}
          </AppText>
          <Badge label={status.label} tone={status.tone} style={{ alignSelf: 'center' }} />
        </View>
        <AppText variant="caption" color="textMuted">
          {compact ? `${formatDate(shift.start)} · ` : ''}
          {formatTimeRange(shift.start, shift.end)} · {minutesToHours(shiftDurationMinutes(shift))}{' '}
          h
        </AppText>
        {!compact ? (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color={t.colors.textMuted} />
            <AppText variant="caption" color="textMuted" numberOfLines={1} style={{ flex: 1 }}>
              {shift.location.name}
            </AppText>
          </View>
        ) : null}
        {conflict ? (
          <View style={styles.row}>
            <Ionicons name="warning-outline" size={14} color={t.colors.warning} />
            <AppText
              variant="caption"
              style={{ color: t.colors.warning, fontFamily: 'Inter_700Bold' }}
            >
              Überschneidung mit einem anderen Einsatz
            </AppText>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, marginBottom: 10, overflow: 'hidden' },
  accent: { width: 4, borderRadius: 4, alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
