import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { triggerHaptic } from '@/components';
import { useTheme } from '@/design/ThemeProvider';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName; activeIcon: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'auftraege', title: 'Aufträge', icon: 'calendar-outline', activeIcon: 'calendar' },
  { name: 'lohn', title: 'Lohn', icon: 'wallet-outline', activeIcon: 'wallet' },
  { name: 'chat', title: 'Chat', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles' },
  { name: 'apps', title: 'Apps', icon: 'grid-outline', activeIcon: 'grid' },
];

/** Schwebende Kapsel-Navigation: Home / Aufträge / Lohn / Chat / Apps (Handy und Computer gleich). */
export default function TabsLayout() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 12);
  return (
    <Tabs
      screenListeners={{ tabPress: () => triggerHaptic() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.tabInactive,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          marginHorizontal: 'auto',
          bottom,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
          borderRadius: 32,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: t.colors.border,
          backgroundColor: t.colors.tabBar,
          maxWidth: 560,
          width: '92%',
        },
        sceneStyle: { backgroundColor: t.colors.background },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarAccessibilityLabel: tab.title,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons name={focused ? tab.activeIcon : tab.icon} color={color} size={size - 1} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
