import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/auth/AuthContext';
import { ThemeProvider, useTheme } from '@/design/ThemeProvider';
import { ClockProvider } from '@/hooks/ClockProvider';

function RootNavigator() {
  const t = useTheme();
  const { status } = useAuth();
  const signedIn = status === 'signedIn';
  return (
    <>
      <StatusBar style={t.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerTintColor: t.colors.primary,
          headerStyle: { backgroundColor: t.colors.background },
          headerTitleStyle: { color: t.colors.text, fontFamily: 'Inter_600SemiBold' },
          headerShadowVisible: false,
          headerBackTitle: 'Zurück',
          contentStyle: { backgroundColor: t.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="zeit" options={{ title: 'Zeiterfassung' }} />
          <Stack.Screen name="aufgaben" options={{ title: 'Meine Aufgaben' }} />
          <Stack.Screen name="profil" options={{ title: 'Profil' }} />
          <Stack.Screen name="melden" options={{ title: 'Melden' }} />
          <Stack.Screen name="dokumente" options={{ title: 'Dokumente' }} />
          <Stack.Screen name="urlaub" options={{ title: 'Urlaub & Verfügbarkeit' }} />
          <Stack.Screen name="learning/index" options={{ title: 'My Learning' }} />
          <Stack.Screen name="learning/[id]" options={{ title: 'Kurs' }} />
          <Stack.Screen name="einsatz/[id]" options={{ title: 'Einsatzdetails' }} />
          <Stack.Screen name="aufgabe/[id]" options={{ title: 'Aufgabe' }} />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  // Auf dem Web und im Test nicht blockieren: ohne Schrift wird kurz die Systemschrift gezeigt.
  void fontsLoaded;
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ClockProvider>
            <RootNavigator />
          </ClockProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
