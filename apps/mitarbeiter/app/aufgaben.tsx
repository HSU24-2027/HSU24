import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Badge,
  Card,
  EmptyState,
  FadeIn,
  PressableScale,
  QueryView,
  Screen,
  SegmentedControl,
} from '@/components';
import { getDataSource } from '@/data';
import { useTheme } from '@/design/ThemeProvider';
import { priorityLabel, taskStatusLabel } from '@/domain/labels';
import type { Task, TaskStatus } from '@/domain/types';
import { useAsync } from '@/hooks/useAsync';
import { formatDateShort, formatTime } from '@/lib/format';

type Filter = 'active' | TaskStatus;
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

export default function TasksScreen() {
  const state = useAsync(() => getDataSource().listTasks());
  const [filter, setFilter] = useState<Filter>('active');

  useFocusEffect(
    useCallback(() => {
      state.refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const toggleDone = async (task: Task) => {
    const next: TaskStatus = task.status === 'done' ? 'open' : 'done';
    state.setData((prev) =>
      (prev ?? []).map((x) => (x.id === task.id ? { ...x, status: next } : x)),
    );
    try {
      await getDataSource().updateTaskStatus(task.id, next);
    } catch {
      state.refresh();
    }
  };

  return (
    <Screen
      withNativeHeader
      title="Meine Aufgaben"
      subtitle="Prioritäten, Fristen und Checklisten."
      onRefresh={state.refresh}
      refreshing={state.refreshing}
      testID="screen-tasks"
    >
      <SegmentedControl
        accessibilityLabel="Filter"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'active', label: 'Aktiv' },
          { value: 'open', label: 'Offen' },
          { value: 'in_progress', label: 'In Arbeit' },
          { value: 'done', label: 'Erledigt' },
        ]}
      />
      <QueryView state={state}>
        {(tasks) => {
          const list = tasks
            .filter((x) => (filter === 'active' ? x.status !== 'done' : x.status === filter))
            .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
          if (list.length === 0) {
            return (
              <EmptyState
                icon="checkmark-done-outline"
                title={filter === 'done' ? 'Noch nichts erledigt' : 'Alles erledigt'}
                message="Hier erscheinen deine Aufgaben."
              />
            );
          }
          return list.map((task, i) => (
            <FadeIn key={task.id} index={i}>
              <TaskRow task={task} onToggle={() => toggleDone(task)} />
            </FadeIn>
          ));
        }}
      </QueryView>
    </Screen>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const t = useTheme();
  const done = task.status === 'done';
  const checklistDone = task.checklist.filter((c) => c.done).length;
  const prio = priorityLabel[task.priority];
  const status = taskStatusLabel[task.status];
  return (
    <Card
      style={styles.row}
      onPress={() => router.push(`/aufgabe/${task.id}`)}
      accessibilityLabel={`${task.title}, ${status.label}, Priorität ${prio.label}`}
    >
      <PressableScale
        haptic
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={done ? 'Als offen markieren' : 'Als erledigt markieren'}
        style={styles.check}
        testID={`task-toggle-${task.id}`}
      >
        <Ionicons
          name={done ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={done ? t.colors.success : t.colors.primary}
        />
      </PressableScale>
      <View style={{ flex: 1, gap: 6 }}>
        <AppText
          variant="bodyStrong"
          style={done ? { textDecorationLine: 'line-through', color: t.colors.textMuted } : null}
        >
          {task.title}
        </AppText>
        <View style={styles.meta}>
          <Badge label={prio.label} tone={prio.tone} />
          <Badge label={status.label} tone={status.tone} />
          {task.due ? (
            <AppText variant="caption" color="textMuted">
              {formatDateShort(task.due)} {formatTime(task.due)}
            </AppText>
          ) : null}
        </View>
        <View style={styles.meta}>
          {task.checklist.length > 0 ? (
            <Meta icon="list-outline" text={`${checklistDone}/${task.checklist.length}`} />
          ) : null}
          {task.commentCount > 0 ? (
            <Meta icon="chatbubble-outline" text={`${task.commentCount}`} />
          ) : null}
          {task.attachmentCount > 0 ? (
            <Meta icon="attach-outline" text={`${task.attachmentCount}`} />
          ) : null}
          {task.shiftId ? <Meta icon="calendar-outline" text="Einsatzbezug" /> : null}
        </View>
      </View>
    </Card>
  );
}

function Meta({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
}) {
  const t = useTheme();
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color={t.colors.textMuted} />
      <AppText variant="caption" color="textMuted">
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  check: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    marginTop: -8,
  },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
