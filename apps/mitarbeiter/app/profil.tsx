import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
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
  SegmentedControl,
} from '@/components';
import { isDemoMode } from '@/config/env';
import { getDataSource } from '@/data';
import { ThemePreference, useThemeContext } from '@/design/ThemeProvider';
import { useAsync } from '@/hooks/useAsync';

const roleLabel = {
  employee: 'Mitarbeiter:in',
  team_lead: 'Teamleitung',
  admin: 'Administration',
} as const;

export default function ProfileScreen() {
  const { theme: t, preference, setPreference } = useThemeContext();
  const { signOut } = useAuth();
  const state = useAsync(() => getDataSource().getProfile());

  return (
    <Screen
      withNativeHeader
      title="Profil"
      subtitle="Dein Bereich, Einstellungen und Hilfe."
      testID="screen-profile"
    >
      <QueryView state={state} rows={1}>
        {(p) => (
          <FadeIn>
            <Card style={styles.profile}>
              <View style={[styles.avatar, { backgroundColor: t.colors.primarySoft }]}>
                <AppText
                  variant="title"
                  color="primary"
                  accessibilityRole="text"
                  importantForAccessibility="no"
                >
                  {p.firstName[0]}
                  {p.lastName[0]}
                </AppText>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <AppText variant="heading">
                  {p.firstName} {p.lastName}
                </AppText>
                <AppText variant="caption" color="textMuted">
                  {p.department}
                </AppText>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  <Badge label={roleLabel[p.role]} tone="primary" />
                  <Badge label={`Nr. ${p.personnelNumber}`} />
                </View>
              </View>
            </Card>
          </FadeIn>
        )}
      </QueryView>

      <Section title="Mein Bereich">
        <ListItem
          icon="chatbubbles-outline"
          title="Nachrichten"
          subtitle="Chats, Einsatz-Nachrichten, Mitteilungen"
          onPress={() => router.push('/chat')}
        />
        <ListItem
          icon="document-text-outline"
          title="Dokumente"
          subtitle="Verträge, Nachweise, Richtlinien"
          onPress={() => router.push('/dokumente')}
        />
        <ListItem
          icon="wallet-outline"
          title="Mein Geld"
          subtitle="Abrechnungen, Stunden, Zuschläge"
          onPress={() => router.push('/lohn')}
        />
        <ListItem
          icon="airplane-outline"
          title="Urlaub & Verfügbarkeit"
          subtitle="Anträge, Abwesenheiten, Wochenplan"
          onPress={() => router.push('/urlaub')}
        />
        <ListItem
          icon="school-outline"
          title="My Learning"
          subtitle="Onboarding, Schulungen, Zertifikate"
          onPress={() => router.push('/learning')}
        />
      </Section>

      <Section title="Darstellung">
        <SegmentedControl<ThemePreference>
          accessibilityLabel="Farbschema"
          value={preference}
          onChange={setPreference}
          options={[
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Hell' },
            { value: 'dark', label: 'Dunkel' },
          ]}
        />
      </Section>

      <Section title="Einstellungen">
        <ListItem
          icon="notifications-outline"
          title="Benachrichtigungen"
          subtitle="Push-Mitteilungen, Sperrbildschirm ohne Inhalte"
        />
        <ListItem
          icon="lock-closed-outline"
          title="Sicherheit"
          subtitle="Passwort, Geräte, biometrische Entsperrung (geplant)"
        />
        <ListItem icon="language-outline" title="Sprache" subtitle="Deutsch" />
        <ListItem
          icon="shield-checkmark-outline"
          title="Datenschutz"
          subtitle="Welche Daten verarbeitet werden"
        />
        <ListItem
          icon="help-circle-outline"
          title="Hilfe & Support"
          subtitle="Kontakt zur Personalabteilung"
        />
      </Section>

      <View style={{ marginTop: 24 }}>
        <Button
          label={isDemoMode ? 'Demo beenden' : 'Abmelden'}
          icon="log-out-outline"
          variant="danger"
          onPress={signOut}
          fullWidth
        />
      </View>
      <AppText variant="caption" color="textSubtle" align="center" style={{ marginTop: 16 }}>
        HSU24 Mitarbeiter-App · Version 1.0.0 {isDemoMode ? '· Demo-Modus' : ''}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
