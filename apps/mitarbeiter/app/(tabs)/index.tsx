import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Badge,
  Card,
  ClockActions,
  FadeIn,
  IconCircle,
  ListItem,
  PressableScale,
  QueryView,
  Screen,
  Section,
  StatCard,
} from '@/components';
import { getDataSource } from '@/data';
import { useTheme } from '@/design/ThemeProvider';
import { remainingLeave } from '@/domain/leave';
import { shiftStatusLabel } from '@/domain/labels';
import { conflictIds, nextShift, startOfWeek } from '@/domain/shifts';
import { formatClock, minutesToHours } from '@/domain/time';
import { clockStateLabel, useClock } from '@/hooks/ClockProvider';
import { useAsync } from '@/hooks/useAsync';
import { formatDateLong, formatTimeRange, greeting, relativeTime } from '@/lib/format';

async function loadDashboard() {
  const ds = getDataSource();
  const [profile, shifts, tasks, notifications, conversations, entries, leave] = await Promise.all([
    ds.getProfile(),
    ds.listShifts(),
    ds.listTasks(),
    ds.listNotifications(),
    ds.listConversations(),
    ds.listTimeEntries(),
    ds.getLeaveBalance(),
  ]);
  return { profile, shifts, tasks, notifications, conversations, entries, leave };
}

const QUICK = [
  { icon: 'calendar-outline', label: 'Einsätze', href: '/auftraege' },
  { icon: 'chatbubbles-outline', label: 'Nachrichten', href: '/chat' },
  { icon: 'document-text-outline', label: 'Dokumente', href: '/dokumente' },
  { icon: 'wallet-outline', label: 'Mein Geld', href: '/lohn' },
  { icon: 'airplane-outline', label: 'Urlaub', href: '/urlaub' },
  { icon: 'school-outline', label: 'My Learning', href: '/learning' },
] as const;

export default function TodayScreen() {
  const t = useTheme();
  const state = useAsync(loadDashboard);
  const clock = useClock();

  return (
    <Screen
      title={`${greeting()}${state.data ? `, ${state.data.profile.firstName}` : ''}`}
      subtitle="Alles Wichtige für deinen Arbeitstag."
      onRefresh={state.refresh}
      refreshing={state.refreshing}
      headerRight={
        <PressableScale
          onPress={() => router.push('/chat')}
          accessibilityLabel="Nachrichten öffnen"
          style={[styles.bell, { backgroundColor: t.colors.primarySoft }]}
        >
          <Ionicons name="notifications-outline" size={22} color={t.colors.primary} />
          {state.data && state.data.notifications.some((n) => !n.read) ? (
            <View
              style={[
                styles.dot,
                { backgroundColor: t.colors.danger, borderColor: t.colors.background },
              ]}
            />
          ) : null}
        </PressableScale>
      }
      testID="screen-today"
    >
      <QueryView state={state} rows={4}>
        {(d) => {
          const upcoming = nextShift(d.shifts);
          const conflicts = conflictIds(d.shifts);
          const openTasks = d.tasks.filter((x) => x.status !== 'done');
          const unread = d.conversations.reduce((sum, c) => sum + c.unread, 0);
          const weekStart = startOfWeek(new Date()).getTime();
          const weekMinutes = d.entries
            .filter((e) => Date.parse(e.start) >= weekStart)
            .reduce((sum, e) => sum + e.workedMinutes, 0);
          return (
            <>
              <FadeIn>
                <Card tone="hero" style={styles.hero}>
                  <View style={styles.heroTop}>
                    <View style={styles.statusPill}>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              clock.state === 'working'
                                ? '#3CC495'
                                : clock.state === 'paused'
                                  ? '#F0B04A'
                                  : '#94A0B0',
                          },
                        ]}
                      />
                      <AppText
                        variant="caption"
                        style={{ color: '#fff', fontFamily: 'Inter_700Bold' }}
                      >
                        {clockStateLabel[clock.state]}
                      </AppText>
                    </View>
                    {clock.state !== 'off' ? (
                      <AppText
                        variant="bodyStrong"
                        style={styles.mono}
                        accessibilityLabel="Arbeitszeit heute"
                      >
                        {formatClock(clock.workedMs)}
                      </AppText>
                    ) : null}
                  </View>
                  {upcoming ? (
                    <PressableScale
                      onPress={() => router.push(`/einsatz/${upcoming.id}`)}
                      accessibilityLabel={`Nächster Einsatz ${upcoming.title}`}
                    >
                      <AppText variant="title" style={{ color: '#fff', marginTop: 18 }}>
                        {upcoming.title}
                      </AppText>
                      <View style={styles.heroMeta}>
                        <Meta
                          icon="time-outline"
                          text={`${formatDateLong(upcoming.start)} · ${formatTimeRange(upcoming.start, upcoming.end)}`}
                        />
                        <Meta icon="location-outline" text={upcoming.location.name} />
                        <Meta icon="person-outline" text={upcoming.contact.name} />
                      </View>
                    </PressableScale>
                  ) : (
                    <AppText variant="title" style={{ color: '#fff', marginTop: 8 }}>
                      Noch kein Einsatz zugewiesen
                    </AppText>
                  )}
                  <View style={{ marginTop: 18 }}>
                    <ClockActions inverse />
                  </View>
                  {clock.error ? (
                    <AppText variant="caption" style={{ color: '#FFB4BD', marginTop: 8 }}>
                      {clock.error}
                    </AppText>
                  ) : null}
                </Card>
              </FadeIn>

              {conflicts.size > 0 ? (
                <FadeIn index={1}>
                  <Card
                    tone="muted"
                    style={[
                      styles.alert,
                      { borderColor: t.colors.warning, backgroundColor: t.colors.warningSoft },
                    ]}
                    onPress={() => router.push('/auftraege')}
                  >
                    <Ionicons name="warning-outline" size={20} color={t.colors.warning} />
                    <AppText
                      variant="caption"
                      style={{ flex: 1, color: t.colors.warning, fontFamily: 'Inter_600SemiBold' }}
                    >
                      {conflicts.size} Einsätze überschneiden sich. Bitte prüfen.
                    </AppText>
                  </Card>
                </FadeIn>
              ) : null}

              <FadeIn index={2}>
                <View style={styles.stats}>
                  <StatCard
                    icon="time-outline"
                    value={`${minutesToHours(weekMinutes)} h`}
                    label="Diese Woche"
                    onPress={() => router.push('/zeit')}
                  />
                  <StatCard
                    icon="checkbox-outline"
                    value={`${openTasks.length}`}
                    label="Offene Aufgaben"
                    tone="warning"
                    onPress={() => router.push('/aufgaben')}
                  />
                </View>
                <View style={[styles.stats, { marginTop: 12 }]}>
                  <StatCard
                    icon="chatbubbles-outline"
                    value={`${unread}`}
                    label="Ungelesen"
                    tone="accent"
                    onPress={() => router.push('/chat')}
                  />
                  <StatCard
                    icon="airplane-outline"
                    value={`${remainingLeave(d.leave)}`}
                    label="Resturlaub (Tage)"
                    tone="success"
                    onPress={() => router.push('/urlaub')}
                  />
                </View>
              </FadeIn>

              <Section title="Schnellzugriff">
                <View style={styles.grid}>
                  {QUICK.map((q, i) => (
                    <FadeIn key={q.href} index={i} style={styles.gridItem}>
                      <Card
                        onPress={() => router.push(q.href)}
                        style={styles.quick}
                        accessibilityLabel={q.label}
                      >
                        <IconCircle name={q.icon} size={40} />
                        <AppText
                          variant="caption"
                          style={{ fontFamily: 'Inter_700Bold' }}
                          numberOfLines={1}
                        >
                          {q.label}
                        </AppText>
                      </Card>
                    </FadeIn>
                  ))}
                </View>
              </Section>

              <Section
                title="Offene Aufgaben"
                action={{ label: 'Alle', onPress: () => router.push('/aufgaben') }}
              >
                {openTasks.slice(0, 3).map((task) => (
                  <ListItem
                    key={task.id}
                    icon={task.priority === 'high' ? 'alert-circle-outline' : 'ellipse-outline'}
                    iconTone={task.priority === 'high' ? 'danger' : 'primary'}
                    title={task.title}
                    subtitle={task.due ? `Fällig ${formatDateLong(task.due)}` : undefined}
                    onPress={() => router.push(`/aufgabe/${task.id}`)}
                  />
                ))}
              </Section>

              <Section title="Mitteilungen">
                {d.notifications.map((n) => (
                  <ListItem
                    key={n.id}
                    icon={
                      n.kind === 'shift'
                        ? 'calendar-outline'
                        : n.kind === 'document'
                          ? 'document-text-outline'
                          : 'information-circle-outline'
                    }
                    iconTone={n.read ? 'neutral' : 'primary'}
                    title={n.title}
                    subtitle={`${n.body} · ${relativeTime(n.at)}`}
                    right={!n.read ? <Badge label="Neu" tone="primary" /> : undefined}
                  />
                ))}
              </Section>

              {upcoming ? (
                <AppText
                  variant="caption"
                  color="textSubtle"
                  align="center"
                  style={{ marginTop: 18 }}
                >
                  Status nächster Einsatz: {shiftStatusLabel[upcoming.status].label}
                </AppText>
              ) : null}
            </>
          );
        }}
      </QueryView>
    </Screen>
  );
}

function Meta({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
}) {
  return (
    <View style={styles.metaRow}>
      <Ionicons name={icon} size={15} color="#B4C1D6" />
      <AppText variant="caption" style={{ color: '#C2CCDC', flex: 1 }} numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bell: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  hero: { padding: 22 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  mono: { color: '#fff', fontVariant: ['tabular-nums'], fontSize: 18 },
  heroMeta: { marginTop: 10, gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alert: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, borderWidth: 1 },
  stats: { flexDirection: 'row', gap: 12, marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  gridItem: { width: '33.333%', padding: 5 },
  quick: { alignItems: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 6 },
});
