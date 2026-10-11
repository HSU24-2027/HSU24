import React from 'react';
import { StyleSheet, View } from 'react-native';

import { clockActionLabel, useClock } from '../hooks/ClockProvider';
import type { TimeEventKind } from '../domain/types';
import { Button, ButtonVariant } from './Button';

const ICONS: Record<TimeEventKind, 'play' | 'pause' | 'play-forward' | 'stop'> = {
  start: 'play',
  pause: 'pause',
  resume: 'play-forward',
  end: 'stop',
};

/** Start / Pause / Fortsetzen / Ende – nur erlaubte Aktionen werden angezeigt. */
export function ClockActions({ inverse = false }: { inverse?: boolean }) {
  const { allowed, record, busy } = useClock();
  return (
    <View style={styles.row}>
      {allowed.map((kind, i) => {
        const variant: ButtonVariant = inverse
          ? i === 0
            ? 'inverse'
            : 'inverseOutline'
          : kind === 'end'
            ? 'danger'
            : i === 0
              ? 'primary'
              : 'secondary';
        return (
          <Button
            key={kind}
            testID={`clock-${kind}`}
            label={clockActionLabel[kind]}
            icon={ICONS[kind]}
            variant={variant}
            loading={busy && i === 0}
            disabled={busy}
            onPress={() => record(kind)}
            style={styles.btn}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  btn: { flexGrow: 1 },
});
