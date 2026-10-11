import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { AppText, Badge, Button, Card, EmptyState, QueryView, Screen } from '@/components';
import { getDataSource } from '@/data';
import { shiftStatusLabel } from '@/domain/labels';
import { useAsync } from '@/hooks/useAsync';
import { formatDateLong, formatTimeRange } from '@/lib/format';

export default function ShiftDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const state = useAsync(async () => (await getDataSource().listShifts()).find((s) => s.id === id));
  const respond = async (shiftId: string, r: 'confirmed' | 'declined') => {
    state.setData(await getDataSource().respondToShift(shiftId, r));
  };
  return (
    <Screen withNativeHeader testID="screen-shift">
      <QueryView state={state}>
        {(s) =>
          !s ? (
            <EmptyState icon="calendar-outline" title="Einsatz nicht gefunden" />
          ) : (
            <>
              <AppText variant="title">{s.title}</AppText>
              <Badge
                label={shiftStatusLabel[s.status].label}
                tone={shiftStatusLabel[s.status].tone}
              />
              <Card style={{ marginTop: 14 }}>
                <AppText variant="bodyStrong">{formatDateLong(s.start)}</AppText>
                <AppText color="textMuted">{formatTimeRange(s.start, s.end)}</AppText>
                <AppText style={{ marginTop: 8 }}>{s.location.name}</AppText>
                <AppText color="textMuted">{s.location.address}</AppText>
                <AppText color="textMuted" style={{ marginTop: 8 }}>
                  Ansprechperson: {s.contact.name}
                  {s.contact.phone ? ` · ${s.contact.phone}` : ''}
                </AppText>
                {s.notes ? <AppText style={{ marginTop: 8 }}>{s.notes}</AppText> : null}
              </Card>
              {s.status === 'offered' ? (
                <>
                  <Button
                    label="Zusagen"
                    onPress={() => respond(s.id, 'confirmed')}
                    fullWidth
                    style={{ marginTop: 14 }}
                  />
                  <Button
                    label="Absagen"
                    variant="danger"
                    onPress={() => respond(s.id, 'declined')}
                    fullWidth
                    style={{ marginTop: 10 }}
                  />
                </>
              ) : null}
            </>
          )
        }
      </QueryView>
    </Screen>
  );
}
