import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';

import { Badge, EmptyState, FadeIn, ListItem, ProgressBar, QueryView, Screen } from '@/components';
import { getDataSource } from '@/data';
import { courseProgress } from '@/domain/learning';
import { useAsync } from '@/hooks/useAsync';

export default function LearningScreen() {
  const state = useAsync(() => getDataSource().listCourses());
  useFocusEffect(
    useCallback(() => {
      state.refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  return (
    <Screen
      withNativeHeader
      title="My Learning"
      subtitle="Schulungen und Onboarding."
      testID="screen-learning"
    >
      <QueryView state={state} rows={3}>
        {(courses) =>
          courses.length === 0 ? (
            <EmptyState icon="school-outline" title="Keine Schulungen" />
          ) : (
            courses.map((c, i) => (
              <FadeIn key={c.id} index={i}>
                <ListItem
                  icon="school-outline"
                  title={c.title}
                  subtitle={`${c.durationMinutes} Min. · ${courseProgress(c)} %`}
                  right={c.mandatory ? <Badge label="Pflicht" tone="warning" /> : null}
                  onPress={() => router.push(`/learning/${c.id}`)}
                />
                <ProgressBar value={courseProgress(c)} />
              </FadeIn>
            ))
          )
        }
      </QueryView>
    </Screen>
  );
}
