import React from 'react';

import { Badge, EmptyState, FadeIn, ListItem, QueryView, Screen } from '@/components';
import { getDataSource } from '@/data';
import { documentCategoryLabel } from '@/domain/labels';
import { useAsync } from '@/hooks/useAsync';
import { formatDate } from '@/lib/format';

export default function DocumentsScreen() {
  const state = useAsync(() => getDataSource().listDocuments());
  return (
    <Screen
      withNativeHeader
      title="Dokumente"
      subtitle="Nur deine eigenen Unterlagen."
      onRefresh={state.refresh}
      refreshing={state.refreshing}
      testID="screen-documents"
    >
      <QueryView state={state} rows={4}>
        {(docs) =>
          docs.length === 0 ? (
            <EmptyState icon="document-text-outline" title="Keine Dokumente" />
          ) : (
            docs.map((d, i) => (
              <FadeIn key={d.id} index={i}>
                <ListItem
                  icon="document-text-outline"
                  title={d.title}
                  subtitle={`${documentCategoryLabel[d.category]} · Version ${d.version} · ${formatDate(d.updatedAt)}`}
                  right={
                    d.requiresAcknowledgement ? <Badge label="Bestätigen" tone="warning" /> : null
                  }
                />
              </FadeIn>
            ))
          )
        }
      </QueryView>
    </Screen>
  );
}
