import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  EmptyState,
  FadeIn,
  PressableScale,
  QueryView,
  Screen,
  Section,
  SegmentedControl,
} from '@/components';
import { getDataSource } from '@/data';
import { useTheme } from '@/design/ThemeProvider';
import {
  CalendarRange,
  conflictIds,
  filterByRange,
  groupByDay,
  startOfWeek,
} from '@/domain/shifts';
import { useAsync } from '@/hooks/useAsync';
import { ShiftCard } from '@/components/ShiftCard';
import { formatDate, formatDateLong, formatMonthYear } from '@/lib/format';

function shiftAnchor(anchor: Date, range: CalendarRange, dir: -1 | 1): Date {
  const d = new Date(anchor);
  if (range === 'day') d.setDate(d.getDate() + dir);
  else if (range === 'week') d.setDate(d.getDate() + 7 * dir);
  else d.setMonth(d.getMonth() + dir);
  return d;
}

function rangeTitle(anchor: Date, range: CalendarRange): string {
  if (range === 'day') return formatDateLong(anchor);
  if (range === 'month') return formatMonthYear(anchor);
  const from = startOfWeek(anchor);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  return `${formatDate(from).slice(0, 6)} – ${formatDate(to)}`;
}

export default function ShiftsScreen() {
  const t = useTheme();
  const state = useAsync(() => getDataSource().listShifts());
  const [range, setRange] = useState<CalendarRange>('week');
  const [anchor, setAnchor] = useState(() => new Date());

  useFocusEffect(
    useCallback(() => {
      state.refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <Screen
      title="Aufträge"
      subtitle="Deine Einsätze und Termine an einem Ort."
      onRefresh={state.refresh}
      refreshing={state.refreshing}
      testID="screen-shifts"
    >
      <SegmentedControl
        accessibilityLabel="Zeitraum"
        value={range}
        onChange={setRange}
        options={[
          { value: 'day', label: 'Tag' },
          { value: 'week', label: 'Woche' },
          { value: 'month', label: 'Monat' },
        ]}
      />
      <View style={styles.nav}>
        <PressableScale
          accessibilityLabel="Vorheriger Zeitraum"
          onPress={() => setAnchor((a) => shiftAnchor(a, range, -1))}
          style={[
            styles.navBtn,
            { backgroundColor: t.colors.surface, borderColor: t.colors.border },
          ]}
        >
          <Ionicons name="chevron-back" size={20} color={t.colors.text} />
        </PressableScale>
        <PressableScale
          onPress={() => setAnchor(new Date())}
          accessibilityLabel="Zu heute springen"
          style={{ flex: 1 }}
        >
          <AppText variant="bodyStrong" align="center">
            {rangeTitle(anchor, range)}
          </AppText>
          <AppText variant="caption" color="primary" align="center">
            Heute
          </AppText>
        </PressableScale>
        <PressableScale
          accessibilityLabel="Nächster Zeitraum"
          onPress={() => setAnchor((a) => shiftAnchor(a, range, 1))}
          style={[
            styles.navBtn,
            { backgroundColor: t.colors.surface, borderColor: t.colors.border },
          ]}
        >
          <Ionicons name="chevron-forward" size={20} color={t.colors.text} />
        </PressableScale>
      </View>

      <QueryView state={state}>
        {(shifts) => {
          const conflicts = conflictIds(shifts);
          const visible = filterByRange(shifts, range, anchor).filter(
            (s) => s.status !== 'completed',
          );
          const groups = groupByDay(visible);
          const history = shifts.filter((s) => s.status === 'completed' || s.status === 'declined');
          return (
            <>
              {groups.length === 0 ? (
                <EmptyState
                  icon="calendar-outline"
                  title="Keine Einsätze in diesem Zeitraum"
                  message="Neue Einsätze erscheinen hier, sobald sie dir angeboten oder zugewiesen werden."
                />
              ) : (
                groups.map((g, gi) => (
                  <FadeIn key={g.date} index={gi}>
                    <AppText variant="label" color="textMuted" style={styles.day}>
                      {formatDateLong(`${g.date}T12:00:00`)}
                    </AppText>
                    {g.shifts.map((s) => (
                      <ShiftCard key={s.id} shift={s} conflict={conflicts.has(s.id)} />
                    ))}
                  </FadeIn>
                ))
              )}
              {history.length > 0 ? (
                <Section title="Verlauf">
                  {history.map((s) => (
                    <ShiftCard key={s.id} shift={s} conflict={false} compact />
                  ))}
                </Section>
              ) : null}
            </>
          );
        }}
      </QueryView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: { marginTop: 16, marginBottom: 8 },
});
