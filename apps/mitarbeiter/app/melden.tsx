import { router } from 'expo-router';
import React, { useState } from 'react';

import { AppText, Button, Card, Screen, SegmentedControl, TextField } from '@/components';
import { getDataSource } from '@/data';
import type { IssueKind } from '@/domain/types';

const OPTIONS: { value: IssueKind; label: string }[] = [
  { value: 'late', label: 'Später' },
  { value: 'sick', label: 'Krank' },
  { value: 'problem', label: 'Problem' },
  { value: 'address', label: 'Adresse' },
];

/** Meldung ans Büro. Das Büro entscheidet; der Kunde wird nur nach Freigabe informiert. */
export default function ReportScreen() {
  const [kind, setKind] = useState<IssueKind>('late');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    setBusy(true);
    setError(null);
    try {
      await getDataSource().reportIssue(kind, note.trim());
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Senden nicht möglich.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      withNativeHeader
      title="Melden"
      subtitle="Das Büro bekommt deine Meldung sofort."
      testID="screen-report"
    >
      {done ? (
        <Card>
          <AppText variant="heading">Meldung gesendet</AppText>
          <AppText color="textMuted" style={{ marginTop: 6, marginBottom: 14 }}>
            Das Büro meldet sich bei dir, falls etwas offen ist.
          </AppText>
          <Button label="Fertig" onPress={() => router.back()} fullWidth />
        </Card>
      ) : (
        <>
          <SegmentedControl
            accessibilityLabel="Art der Meldung"
            value={kind}
            onChange={setKind}
            options={OPTIONS}
          />
          <TextField
            label="Hinweis (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="z. B. 15 Minuten später wegen Bahn"
          />
          {error ? (
            <AppText color="danger" style={{ marginBottom: 12 }}>
              {error}
            </AppText>
          ) : null}
          <Button label="Senden" icon="send-outline" loading={busy} onPress={send} fullWidth />
        </>
      )}
    </Screen>
  );
}
