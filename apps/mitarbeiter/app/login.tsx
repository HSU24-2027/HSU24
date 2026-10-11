import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/AuthContext';
import { AppText, Button, Card, DemoBanner, FadeIn, TextField } from '@/components';
import { useTheme } from '@/design/ThemeProvider';

export default function LoginScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { isDemo, signIn, startDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(undefined);
    if (!email.includes('@') || password.length < 8) {
      setError('Bitte gültige E-Mail und ein Passwort mit mindestens 8 Zeichen eingeben.');
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Anmeldung fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.hero }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <FadeIn>
            <View style={styles.logoRow}>
              <View style={[styles.logo, { backgroundColor: t.colors.primary }]}>
                <Ionicons name="shield-checkmark" size={26} color="#fff" />
              </View>
              <AppText variant="label" style={{ color: '#B8CBFF' }}>
                HSU24 • Mitarbeiter
              </AppText>
            </View>
            <AppText variant="display" style={{ color: '#fff', marginTop: 28 }}>
              Dein Arbeitsbereich.{'\n'}Sicher & übersichtlich.
            </AppText>
            <AppText style={{ color: t.colors.heroMuted, marginTop: 12 }}>
              Einsätze, Zeiterfassung, Aufgaben, Dokumente und Schulungen an einem Ort.
            </AppText>
          </FadeIn>

          <FadeIn delay={120}>
            <Card style={{ marginTop: 32 }}>
              {isDemo ? (
                <>
                  <DemoBanner text="Kein Backend verbunden. Die App zeigt erfundene Beispieldaten." />
                  <AppText variant="heading">Vorschau starten</AppText>
                  <AppText
                    variant="caption"
                    color="textMuted"
                    style={{ marginTop: 4, marginBottom: 16 }}
                  >
                    Ohne Anmeldung, ohne echte Personal-, Zeit- oder Lohndaten.
                  </AppText>
                  <Button
                    label="Demo öffnen"
                    icon="arrow-forward"
                    onPress={startDemo}
                    fullWidth
                    size="lg"
                    testID="start-demo"
                  />
                </>
              ) : (
                <>
                  <AppText variant="heading" style={{ marginBottom: 16 }}>
                    Anmelden
                  </AppText>
                  <TextField
                    label="Dienstliche E-Mail"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="username"
                    placeholder="name@firma.de"
                  />
                  <TextField
                    label="Passwort"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                    error={error}
                  />
                  <Button label="Anmelden" onPress={submit} loading={busy} fullWidth size="lg" />
                </>
              )}
            </Card>
          </FadeIn>
          <AppText
            variant="caption"
            align="center"
            style={{ color: t.colors.heroMuted, marginTop: 20 }}
          >
            Deine Daten werden verschlüsselt übertragen. Zugriff nur auf deine eigenen Daten.
          </AppText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 22 },
  inner: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
