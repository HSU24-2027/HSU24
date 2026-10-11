import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { AppText, Card, EmptyState, ListItem, QueryView, Screen } from '@/components';
import { getDataSource } from '@/data';
import { courseProgress } from '@/domain/learning';
import { useAsync } from '@/hooks/useAsync';

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const state = useAsync(async () =>
    (await getDataSource().listCourses()).find((c) => c.id === id),
  );
  const complete = async (courseId: string, lessonId: string) => {
    const updated = await getDataSource().completeLesson(courseId, lessonId);
    state.setData(updated);
  };
  return (
    <Screen withNativeHeader testID="screen-course">
      <QueryView state={state}>
        {(course) =>
          !course ? (
            <EmptyState icon="school-outline" title="Kurs nicht gefunden" />
          ) : (
            <>
              <AppText variant="title">{course.title}</AppText>
              <AppText color="textMuted" style={{ marginVertical: 8 }}>
                {course.description}
              </AppText>
              <Card style={{ marginBottom: 12 }}>
                <AppText variant="bodyStrong">Fortschritt {courseProgress(course)} %</AppText>
              </Card>
              {course.lessons.map((l) => (
                <ListItem
                  key={l.id}
                  icon={l.done ? 'checkmark-circle' : 'ellipse-outline'}
                  iconTone={l.done ? 'success' : 'neutral'}
                  title={l.title}
                  showChevron={false}
                  onPress={l.done ? undefined : () => complete(course.id, l.id)}
                />
              ))}
            </>
          )
        }
      </QueryView>
    </Screen>
  );
}
