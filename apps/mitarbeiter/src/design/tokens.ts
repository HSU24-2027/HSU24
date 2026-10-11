/**
 * HSU24 Designsystem – Design-Tokens.
 * Revolut-Stil: Standard ist klassisch weiß (lightColors); dunkel bleibt wählbar.
 */
export const palette = {
  navy900: '#0B1729',
  navy800: '#12243B', // #12243B
  navy700: '#1C3352',
  blue600: '#2449D8',
  blue500: '#315CF5', // #315CF5
  blue400: '#5C7EF7',
  blue100: '#EAF0FF',
  blue50: '#F3F6FF',
  slate500: '#778599', // #778599
  slate400: '#94A0B0',
  slate300: '#C2CCDC',
  slate200: '#E5EBF2', // #E5EBF2
  slate100: '#F4F7FB', // #F4F7FB
  white: '#FFFFFF',
  green600: '#14805E', // #14805E
  green100: '#E3F5EE',
  red600: '#BE3445', // #BE3445
  red100: '#FBE9EB',
  amber600: '#B26B00',
  amber100: '#FFF3DC',
} as const;

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  onPrimary: string;
  hero: string;
  heroText: string;
  heroMuted: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  tabBar: string;
  tabInactive: string;
  overlay: string;
};

export const lightColors: ThemeColors = {
  background: '#FAF9F6',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F2F1ED',
  border: '#E5E9E5',
  text: '#111817',
  textMuted: '#818B87',
  textSubtle: '#A3ACA8',
  primary: '#005C56',
  primaryPressed: '#003F3B',
  primarySoft: '#DDF7F3',
  onPrimary: '#FFFFFF',
  hero: '#005C56',
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.72)',
  success: '#16856B',
  successSoft: 'rgba(22,133,107,0.12)',
  warning: '#B77922',
  warningSoft: 'rgba(183,121,34,0.12)',
  danger: '#D85D56',
  dangerSoft: 'rgba(216,93,86,0.12)',
  accent: '#E6338F',
  accentSoft: '#FFE3F1',
  accentStrong: '#B8216F',
  tabBar: '#FFFFFF',
  tabInactive: '#818B87',
  overlay: 'rgba(17,24,23,0.45)',
};

export const darkColors: ThemeColors = {
  background: '#0C0E0D',
  surface: '#161A18',
  surfaceElevated: '#1E2321',
  surfaceMuted: '#1A1F1D',
  border: 'rgba(255,255,255,0.10)',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.64)',
  textSubtle: 'rgba(255,255,255,0.42)',
  primary: '#5BD6C8',
  primaryPressed: '#3FBFB0',
  primarySoft: 'rgba(91,214,200,0.14)',
  onPrimary: '#0C0E0D',
  hero: '#0B3F3B',
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.64)',
  success: '#6EE7A0',
  successSoft: 'rgba(110,231,160,0.14)',
  warning: '#FCD34D',
  warningSoft: 'rgba(252,211,77,0.14)',
  danger: '#FB7185',
  dangerSoft: 'rgba(251,113,133,0.14)',
  accent: '#FF5FAF',
  accentSoft: 'rgba(255,95,175,0.16)',
  accentStrong: '#FF8CC6',
  tabBar: '#161A18',
  tabInactive: 'rgba(255,255,255,0.5)',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxs: 2, xxl: 48 } as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 28,
  pill: 999,
} as const;

/** Schriftfamilie: Inter (geladen in app/_layout.tsx), je Gewicht eine Datei. */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontFamily: fonts.bold, letterSpacing: -0.6 },
  title: { fontSize: 22, lineHeight: 28, fontFamily: fonts.semibold, letterSpacing: -0.3 },
  heading: { fontSize: 18, lineHeight: 24, fontFamily: fonts.semibold },
  body: { fontSize: 15, lineHeight: 22, fontFamily: fonts.regular },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontFamily: fonts.semibold },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: fonts.regular },
  label: { fontSize: 11, lineHeight: 14, fontFamily: fonts.semibold, letterSpacing: 0.8 },
  metric: { fontSize: 36, lineHeight: 42, fontFamily: fonts.bold, letterSpacing: -0.8 },
} as const;

export type TypographyVariant = keyof typeof typography;

export const motion = {
  fast: 150,
  normal: 240,
  slow: 380,
  stagger: 45,
} as const;

export const minTouchTarget = 44;

export type AppTheme = {
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  motion: typeof motion;
};

export function buildTheme(scheme: ColorScheme): AppTheme {
  return {
    scheme,
    colors: scheme === 'dark' ? darkColors : lightColors,
    spacing,
    radius,
    typography,
    motion,
  };
}
