import { router } from 'expo-router';
import React from 'react';

import { FadeIn, ListItem, Screen, Section } from '@/components';

/** Alles Weitere an einem Ort. Vom Chef freigeschaltete Apps kommen später aus den Rechten. */
export default function AppsScreen() {
  return (
    <Screen title="Apps" subtitle="Alles, was du für deine Arbeit brauchst." testID="screen-apps">
      <FadeIn>
        <Section title="Mein Bereich">
          <ListItem
            icon="timer-outline"
            title="Zeiterfassung"
            subtitle="Arbeitszeit erfassen"
            onPress={() => router.push('/zeit')}
          />
          <ListItem
            icon="checkbox-outline"
            title="Meine Aufgaben"
            subtitle="Checkliste für den Einsatz"
            onPress={() => router.push('/aufgaben')}
          />
          <ListItem
            icon="megaphone-outline"
            title="Melden"
            subtitle="Später, krank, Problem, Adresse falsch"
            onPress={() => router.push('/melden')}
          />
          <ListItem
            icon="document-text-outline"
            title="Dokumente"
            subtitle="Verträge, Nachweise, Richtlinien"
            onPress={() => router.push('/dokumente')}
          />
          <ListItem
            icon="airplane-outline"
            title="Urlaub & Verfügbarkeit"
            subtitle="Anträge und Wochenverfügbarkeit"
            onPress={() => router.push('/urlaub')}
          />
          <ListItem
            icon="school-outline"
            title="My Learning"
            subtitle="Schulungen und Onboarding"
            onPress={() => router.push('/learning')}
          />
          <ListItem
            icon="person-outline"
            title="Profil"
            subtitle="Einstellungen und Hilfe"
            onPress={() => router.push('/profil')}
          />
        </Section>
      </FadeIn>
    </Screen>
  );
}
