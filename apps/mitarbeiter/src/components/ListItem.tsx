import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../design/ThemeProvider';
import { minTouchTarget } from '../design/tokens';
import { AppText } from './AppText';
import { IconCircle, IconName } from './IconCircle';
import { PressableScale } from './Pressable';

export type ListItemProps = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  iconTone?: React.ComponentProps<typeof IconCircle>['tone'];
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  testID?: string;
};

/** Listenzeile im Stil des Prototyp-"Tile" (Icon, Titel, Detail, Chevron). */
export function ListItem({
  title,
  subtitle,
  icon,
  iconTone,
  right,
  onPress,
  showChevron = !!onPress,
  testID,
}: ListItemProps) {
  const t = useTheme();
  const body = (
    <View style={[styles.row, { minHeight: minTouchTarget + 12 }]}>
      {icon ? <IconCircle name={icon} tone={iconTone} /> : null}
      <View style={styles.flex}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="textMuted" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={18} color={t.colors.textSubtle} />
      ) : null}
    </View>
  );
  const container = [
    styles.container,
    {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderRadius: t.radius.md + 1,
    },
  ];
  if (!onPress) return <View style={container}>{body}</View>;
  return (
    <PressableScale
      testID={testID}
      onPress={onPress}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      style={container}
    >
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1, gap: 2 },
  right: { alignSelf: 'center' },
});
