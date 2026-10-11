import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Badge,
  Button,
  Card,
  ClockActions,
  FadeIn,
  ListItem,
  QueryView,
  Screen,
  Section,
  SegmentedControl,
  TextField,
} from '@/components';
import { getDataSource } from '@/data';
import { useTheme } from '@/design/ThemeProvider';
import { approvalLabel } from '@/domain/labels';
import { startOfWeek } from '@/domain/shifts';
import { formatClock, formatDuration, minutesToHours, requiredBreakMinutes } from '@/domain/time';
import type { TimeEntry, TimeEventKind } from '@/domain/types';
import { clockEventLabel, clockStateLabel, useClock } from '@/hooks/ClockProvider';
import { useAsync } from '@/hooks/useAsync';
import { formatDate, formatTime, formatTimeRange } from '@/lib/format';

type Period = 'day' | 'week' | 'month';

function sumFor(entries: TimeEntry[], period: Period, now = new Date()): number {
  let from: number;
  if (period === 'day') from = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  else if (period === 'week') from = startOfWeek(now).getTime();
  else from = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  return entries
    .filter((e) => Date.parse(e.start) >= from)
    .reduce((s, e) => s + e.workedMinutes, 0);
}

const EVENT_ICON: Record<
  TimeEventKind,
  | 'play-circle-outline'
  | 'pause-circle-outline'
  | 'play-forward-circle-outline'
  | 'stop-circle-outline'
> = {
  start: 'play-circle-outline',
  pause: 'pause-circle-outline',
  resume: 'play-forward-circle-outline',
  end: 'stop-circle-outline',
};

export default function TimeScreen() {
  const t = useTheme();
  const clock = useClock();
  const entries = useAsync(() => getDataSource().listTimeEntries());
  const [period, setPeriod] = useState<Period>('week');
  const [correcting, setCorrecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string>();

  const workedMinutes = Math.floor(clock.workedMs / 60000);
  const requiredBreak = requiredBreakMinutes(workedMinutes);
  const breakMinutes = Math.floor(clock.breakMs / 60000);

  const submitCorrection = async (entryId: string) => {
    setError(undefined);
    try {
      await getDataSource().requestTimeCorrection(entryId, reason);
      setCorrecting(null);
      setReason('');
      entries.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler');
    }
  };

  return (
    <Screen
      withNativeHeader
      title="Zeiterfassung"
      subtitle="Start, Pause und Ende – nachvollziehbar und transparent."
      demoNote="Testmodus: Zeiten werden nicht gespeichert und sind keine echten Arbeitszeiten."
      onRefresh={entries.refresh}
      refreshing={entries.refreshing}
      testID="screen-time"
    >
      <FadeIn>
        <Card style={styles.clockCard}>
          <Badge
            label={clockStateLabel[clock.state]}
            tone={
              clock.state === 'working'
                ? 'success'
                : clock.state === 'paused'
                  ? 'warning'
                  : 'neutral'
            }
          />
          <AppText
            style={[styles.timer, { color: t.colors.text }]}
            accessibilityLabel={`Arbeitszeit ${formatDuration(clock.workedMs)}`}
          >
            {formatClock(clock.workedMs)}
          </AppText>
          <AppText variant="caption" color="textMuted">
            Pause heute: {formatDuration(clock.breakMs)}
          </AppText>
          <View style={{ alignSelf: 'stretch', marginTop: 18 }}>
            <ClockActions />
          </View>
          {clock.error ? (
            <AppText variant="caption" color="danger" style={{ marginTop: 8 }}>
              {clock.error}
            </AppText>
          ) : null}
          {requiredBreak > breakMinutes ? (
            <AppText variant="caption" color="warning" align="center" style={{ marginTop: 12 }}>
              Hinweis: Ab dieser Arbeitsdauer sind mindestens {requiredBreak} Minuten Pause
              vorgeschrieben (§ 4 ArbZG).
            </AppText>
          ) : null}
          <AppText variant="caption" color="textSubtle" align="center" style={{ marginTop: 12 }}>
            Zeitstempel werden im Live-Betrieb vom Server gesetzt und revisionssicher protokolliert.
          </AppText>
        </Card>
      </FadeIn>

      {clock.events.length > 0 ? (
        <Section title="Heute protokolliert">
          {clock.events.map((e) => (
            <ListItem
              key={e.id}
              icon={EVENT_ICON[e.kind]}
              title={clockEventLabel[e.kind]}
              subtitle={`${formatTime(e.at)} Uhr`}
            />
          ))}
        </Section>
      ) : null}

      <Section title="Übersicht">
        <SegmentedControl
          accessibilityLabel="Zeitraum"
          value={period}
          onChange={setPeriod}
          options={[
            { value: 'day', label: 'Tag' },
            { value: 'week', label: 'Woche' },
            { value: 'month', label: 'Monat' },
          ]}
        />
        <QueryView state={entries}>
          {(list) => (
            <>
              <Card tone="muted" style={styles.sum}>
                <AppText variant="caption" color="textMuted">
                  Erfasste Stunden (
                  {period === 'day' ? 'heute' : period === 'week' ? 'diese Woche' : 'dieser Monat'})
                </AppText>
                <AppText variant="metric">{minutesToHours(sumFor(list, period))} h</AppText>
              </Card>
              {list.map((entry) => {
                const status = approvalLabel[entry.status];
                return (
                  <View key={entry.id}>
                    <ListItem
                      icon="time-outline"
                      title={formatDate(entry.date)}
                      subtitle={`${entry.end ? formatTimeRange(entry.start, entry.end) : formatTime(entry.start)} · ${minutesToHours(entry.workedMinutes)} h · Pause ${entry.breakMinutes} min`}
                      right={<Badge label={status.label} tone={status.tone} />}
                      showChevron={false}
                      onPress={() => {
                        setCorrecting(correcting === entry.id ? null : entry.id);
                        setError(undefined);
                      }}
                    />
                    {correcting === entry.id ? (
                      <Card style={{ marginBottom: 10 }}>
                        <TextField
                          label="Korrekturantrag"
                          hint="Beschreibe, was korrigiert werden soll. Die Teamleitung prüft den Antrag."
                          value={reason}
                          onChangeText={setReason}
                          error={error}
                          multiline
                        />
                        <Button
                          label="Korrektur beantragen"
                          icon="create-outline"
                          onPress={() => submitCorrection(entry.id)}
                          fullWidth
                        />
                      </Card>
                    ) : null}
                  </View>
                );
              })}
              <AppText variant="caption" color="textSubtle" align="center">
                Tippe auf einen Eintrag, um eine Korrektur zu beantragen.
              </AppText>
            </>
          )}
        </QueryView>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  clockCard: { alignItems: 'center', paddingVertical: 26 },
  timer: {
    fontSize: 52,
    lineHeight: 60,
    fontFamily: 'Inter_700Bold',
    fontVariant: ['tabular-nums'],
    marginTop: 14,
  },
  sum: { marginBottom: 12, gap: 4 },
});
