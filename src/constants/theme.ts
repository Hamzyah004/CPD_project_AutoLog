export const Colors = {
  light: {
    text: '#0F172A',
    muted: '#475569',
    background: '#F8FAFC',
    card: '#E6EEF7',
    border: '#CBD5E1',
    primary: '#2563EB', // AutoLog cobalt blue
    onPrimary: '#FFFFFF',
    photoBg: '#DAE4F0',
    surface: '#FFFFFF',
    secondaryBg: '#E2E8F0',
    banner: '#0F172A',
    onBanner: '#FFFFFF',
    bannerMuted: '#94A3B8',
    bannerButton: '#1E293B',
    accentBg: '#DBEAFE',
    accentBorder: '#93C5FD',
    accentText: '#1D4ED8',
    dangerBg: '#FEE2E2',
    dangerText: '#B91C1C',
  },
  dark: {
    text: '#F2F4F7',
    muted: '#9AA6B5',
    background: '#0B1220',
    card: '#182132',
    border: '#2A3446',
    primary: '#60A5FA', // Lighter blue for dark mode readability
    onPrimary: '#0B1220',
    photoBg: '#1E293B',
    surface: '#111827',
    secondaryBg: '#2A3446',
    banner: '#111827',
    onBanner: '#F2F4F7',
    bannerMuted: '#9AA6B5',
    bannerButton: '#2A3446',
    accentBg: '#1E3A5F',
    accentBorder: '#3B82F6',
    accentText: '#93C5FD',
    dangerBg: '#3F1D24',
    dangerText: '#FCA5A5',
  },
} as const;

export type Theme = {
  [K in keyof (typeof Colors)['light']]: string;
};

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const FontSize = { small: 13, body: 16, title: 20, hero: 28 } as const;
export const Radius = { sm: 8, md: 12, pill: 999 } as const;
