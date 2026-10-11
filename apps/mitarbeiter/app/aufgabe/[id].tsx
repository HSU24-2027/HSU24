import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { AppText, Badge, Button, EmptyState, ListItem, QueryView, Screen } from '@/components';
import { getDataSource } from '@/data';
import { priorityLabel, taskStatusLabel } from '@/domain/labels';
import { useAsync } from '@/hooks/useAsync';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const state = useAsync(async () => (await getDataSource().listTasks()).find((x) => x.id === id));
  return (
    <Screen withNativeHeader testID="screen-task">
      <QueryView state={state}>
        {(task) =>
          !task ? (
            <EmptyState icon="checkbox-outline" title="Aufgabe nicht gefunden" />
          ) : (
            <>
              <AppText variant="title">{task.title}</AppText>
              <Badge
                label={taskStatusLabel[task.status].label}
                tone={taskStatusLabel[task.status].tone}
              />
              <Badge
                label={priorityLabel[task.priority].label}
                tone={priorityLabel[task.priority].tone}
              />
              {task.description ? (
                <AppText color="textMuted" style={{ marginVertical: 10 }}>
                  {task.description}
                </AppText>
              ) : null}
              {task.checklist.map((c) => (
                <ListItem
                  key={c.id}
                  icon={c.done ? 'checkmark-circle' : 'ellipse-outline'}
                  iconTone={c.done ? 'success' : 'neutral'}
                  title={c.label}
                  showChevron={false}
                  onPress={async () =>
                    state.setData(await getDataSource().toggleChecklistItem(task.id, c.id))
                  }
                />
              ))}
              {task.status !== 'done' ? (
                <Button
                  label="Als erledigt markieren"
                  onPress={async () =>
                    state.setData(await getDataSource().updateTaskStatus(task.id, 'done'))
                  }
                  fullWidth
                  style={{ marginTop: 14 }}
                />
              ) : null}
            </>
          )
        }
      </QueryView>
    </Screen>
  );
}
