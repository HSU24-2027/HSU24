import React from 'react';
import { View } from 'react-native';

import { AppText, Badge, Card, EmptyState, FadeIn, QueryView, Screen } from '@/components';
import { getDataSource } from '@/data';
import { useAsync } from '@/hooks/useAsync';
import { formatCurrency, formatDate, formatPeriod } from '@/lib/format';

/** Lohn und Gehalt: Beträge kommen nur aus dem Büro-System, nie aus Eingaben in der App. */
export default function PayScreen() {
  const state = useAsync(() => getDataSource().listPayslips());
  return (
    <Screen
      title="Lohn"
      subtitle="Deine Abrechnungen und Auszahlungen."
      onRefresh={state.refresh}
      refreshing={state.refreshing}
      testID="screen-pay"
    >
      <QueryView state={state} rows={3}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState
              icon="wallet-outline"
              title="Noch keine Abrechnung"
              message="Stunden und Auszahlung erscheinen hier, sobald das Büro abgerechnet hat."
            />
          ) : (
            list.map((p, i) => (
              <FadeIn key={p.id} index={i}>
                <Card style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <AppText variant="heading">{formatPeriod(p.period)}</AppText>
                    <Badge
                      label={p.status === 'paid' ? 'Ausgezahlt' : 'In Bearbeitung'}
                      tone={p.status === 'paid' ? 'success' : 'warning'}
                    />
                  </View>
                  <AppText variant="metric" style={{ marginTop: 8 }}>
                    {formatCurrency(p.netCents)}
                  </AppText>
                  <AppText variant="caption" color="textMuted">
                    Netto · Brutto {formatCurrency(p.grossCents)} · {p.hours} Std.
                    {p.paidOn ? ` · am ${formatDate(p.paidOn)}` : ''}
                  </AppText>
                </Card>
              </FadeIn>
            ))
          )
        }
      </QueryView>
    </Screen>
  );
}
