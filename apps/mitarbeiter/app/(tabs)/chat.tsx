import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { View } from 'react-native';

import {
  AppText,
  Badge,
  EmptyState,
  FadeIn,
  ListItem,
  QueryView,
  Screen,
  Section,
} from '@/components';
import { getDataSource } from '@/data';
import { useAsync } from '@/hooks/useAsync';
import { relativeTime } from '@/lib/format';

/** Nachrichten und Mitteilungen. */
export default function ChatScreen() {
  const state = useAsync(async () => {
    const ds = getDataSource();
    const [conversations, notifications] = await Promise.all([
      ds.listConversations(),
      ds.listNotifications(),
    ]);
    return { conversations, notifications };
  });
  useFocusEffect(
    useCallback(() => {
      state.refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  return (
    <Screen
      title="Chat"
      subtitle="Nachrichten und Mitteilungen."
      onRefresh={state.refresh}
      refreshing={state.refreshing}
      testID="screen-chat"
    >
      <QueryView state={state} rows={4}>
        {({ conversations, notifications }) => (
          <>
            <Section title="Unterhaltungen">
              {conversations.length === 0 ? (
                <EmptyState icon="chatbubbles-outline" title="Keine Unterhaltungen" />
              ) : (
                conversations.map((c, i) => (
                  <FadeIn key={c.id} index={i}>
                    <ListItem
                      icon={c.kind === 'announcement' ? 'megaphone-outline' : 'chatbubble-outline'}
                      title={c.title}
                      subtitle={`${c.lastMessage} · ${relativeTime(c.lastMessageAt)}`}
                      right={c.unread > 0 ? <Badge label={String(c.unread)} tone="accent" /> : null}
                    />
                  </FadeIn>
                ))
              )}
            </Section>
            <Section title="Mitteilungen">
              {notifications.length === 0 ? (
                <AppText color="textMuted">Keine neuen Mitteilungen.</AppText>
              ) : (
                notifications.map((n) => (
                  <View key={n.id}>
                    <ListItem
                      icon="notifications-outline"
                      title={n.title}
                      subtitle={n.body}
                      right={!n.read ? <Badge label="Neu" tone="primary" /> : null}
                    />
                  </View>
                ))
              )}
            </Section>
          </>
        )}
      </QueryView>
    </Screen>
  );
}
