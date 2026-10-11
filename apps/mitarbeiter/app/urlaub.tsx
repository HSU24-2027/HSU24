import React, { useState } from 'react';
import { View } from 'react-native';

import {
  AppText,
  Badge,
  Button,
  Card,
  FadeIn,
  ListItem,
  QueryView,
  Screen,
  Section,
  TextField,
} from '@/components';
import { getDataSource } from '@/data';
import { approvalLabel, leaveTypeLabel, weekdayLabel } from '@/domain/labels';
import { remainingLeave, validateLeaveRequest } from '@/domain/leave';
import { useAsync } from '@/hooks/useAsync';
import { formatDate } from '@/lib/format';

export default function LeaveScreen() {
  const state = useAsync(async () => {
    const ds = getDataSource();
    const [balance, requests, availability] = await Promise.all([
      ds.getLeaveBalance(),
      ds.listLeaveRequests(),
      ds.getAvailability(),
    ]);
    return { balance, requests, availability };
  });
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (balance: Parameters<typeof validateLeaveRequest>[2]) => {
    const check = validateLeaveRequest(from, to, balance);
    if (!check.ok) {
      setError(check.reason);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await getDataSource().createLeaveRequest({ type: 'vacation', from, to, days: check.days });
      setFrom('');
      setTo('');
      await state.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Antrag nicht möglich.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      withNativeHeader
      title="Urlaub"
      subtitle="Anträge und Wochenverfügbarkeit."
      onRefresh={state.refresh}
      refreshing={state.refreshing}
      testID="screen-leave"
    >
      <QueryView state={state} rows={3}>
        {({ balance, requests, availability }) => (
          <>
            <Card>
              <AppText variant="caption" color="textMuted">
                Resturlaub
              </AppText>
              <AppText variant="metric">{remainingLeave(balance)} Tage</AppText>
            </Card>
            <Section title="Neuer Antrag">
              <TextField label="Von (JJJJ-MM-TT)" value={from} onChangeText={setFrom} />
              <TextField label="Bis (JJJJ-MM-TT)" value={to} onChangeText={setTo} />
              {error ? (
                <AppText color="danger" style={{ marginBottom: 10 }}>
                  {error}
                </AppText>
              ) : null}
              <Button label="Beantragen" loading={busy} onPress={() => submit(balance)} fullWidth />
            </Section>
            <Section title="Meine Anträge">
              {requests.length === 0 ? (
                <AppText color="textMuted">Noch keine Anträge.</AppText>
              ) : (
                requests.map((r, i) => (
                  <FadeIn key={r.id} index={i}>
                    <ListItem
                      icon="airplane-outline"
                      title={`${leaveTypeLabel[r.type]} · ${r.days} Tage`}
                      subtitle={`${formatDate(r.from)} – ${formatDate(r.to)}`}
                      right={
                        <Badge
                          label={approvalLabel[r.status].label}
                          tone={approvalLabel[r.status].tone}
                        />
                      }
                    />
                  </FadeIn>
                ))
              )}
            </Section>
            <Section title="Verfügbarkeit">
              <View>
                {availability.map((a) => (
                  <ListItem
                    key={a.weekday}
                    title={weekdayLabel[a.weekday]}
                    subtitle={a.note}
                    right={
                      <Badge
                        label={a.available ? 'Verfügbar' : 'Nicht verfügbar'}
                        tone={a.available ? 'success' : 'neutral'}
                      />
                    }
                  />
                ))}
              </View>
            </Section>
          </>
        )}
      </QueryView>
    </Screen>
  );
}
