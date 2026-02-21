import { Platform } from 'react-native';

const lightTheme = {
  text: '#102318',
  textMuted: '#4A6353',
  textInverse: '#F4FFF7',
  background: '#F2F8F3',
  surface: '#FFFFFF',
  surfaceElevated: '#E9F5EB',
  border: '#C9DFCF',
  primary: '#2F8F45',
  primaryStrong: '#1F6F33',
  primarySoft: '#D8EFDC',
  primaryContrast: '#F2FFF4',
  danger: '#C23A3A',
  dangerSoft: '#FBE3E3',
  dangerContrast: '#7A1D1D',
  success: '#2D8A43',
  successSoft: '#D7F1DD',
  warning: '#B97418',
  warningSoft: '#FCECCF',
  info: '#2A7AB7',
  infoSoft: '#DDEFFC',
  inputBackground: '#FFFFFF',
  placeholder: '#6B7E72',
};

const darkTheme = {
  text: '#E8F5EC',
  textMuted: '#A0B8A8',
  textInverse: '#0A1C12',
  background: '#0B1710',
  surface: '#112218',
  surfaceElevated: '#173020',
  border: '#284334',
  primary: '#54C16D',
  primaryStrong: '#73D88A',
  primarySoft: '#1E4B2D',
  primaryContrast: '#092012',
  danger: '#F07A7A',
  dangerSoft: '#572727',
  dangerContrast: '#FFD7D7',
  success: '#57CC74',
  successSoft: '#214A2D',
  warning: '#E6B15E',
  warningSoft: '#4C3A18',
  info: '#6FB2E0',
  infoSoft: '#1D3E54',
  inputBackground: '#173020',
  placeholder: '#9BB0A3',
};

export const Colors = {
  light: {
    ...lightTheme,
    tint: lightTheme.primary,
    icon: lightTheme.textMuted,
    tabIconDefault: lightTheme.textMuted,
    tabIconSelected: lightTheme.primary,
  },
  dark: {
    ...darkTheme,
    tint: darkTheme.primary,
    icon: darkTheme.textMuted,
    tabIconDefault: darkTheme.textMuted,
    tabIconSelected: darkTheme.primary,
  },
};

export type AppThemeName = keyof typeof Colors;
export type AppColors = (typeof Colors)['light'];

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
