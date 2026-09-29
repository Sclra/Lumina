import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface ThemeTokens {
  bg: string;
  bgAlt: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  textFaint: string;
  primary: string;
  primaryText: string;
  primaryPale: string;
  paidBg: string; paidText: string; paidDot: string;
  dueBg: string; dueText: string; dueDot: string;
  futureBg: string; futureText: string; futureDot: string;
  border: string;
  borderLight: string;
  inputBg: string;
  mutedSurface: string;
  navBg: string;
}

export const light: ThemeTokens = {
  bg: '#F5F3EE',
  bgAlt: '#EDE9E2',
  card: '#FFFFFF',
  cardBorder: '#E5E1D8',
  text: '#1A1A18',
  textMuted: '#6B6864',
  textFaint: '#9A9690',
  primary: '#1A4A38',
  primaryText: '#FFFFFF',
  primaryPale: '#E8F5EE',
  paidBg: '#E8F5EE', paidText: '#1A6B4A', paidDot: '#1A6B4A',
  dueBg: '#FEF2EE', dueText: '#C94A2E', dueDot: '#C94A2E',
  futureBg: '#F0EFED', futureText: '#9A9690', futureDot: '#C0BAB2',
  border: '#E5E1D8',
  borderLight: '#F0EFED',
  inputBg: '#FFFFFF',
  mutedSurface: '#F8F7F4',
  navBg: '#FFFFFF',
};

export const dark: ThemeTokens = {
  bg: '#111614',
  bgAlt: '#181C1A',
  card: '#1C2220',
  cardBorder: '#262E2A',
  text: '#E8E4DF',
  textMuted: '#7A8480',
  textFaint: '#4E5854',
  primary: '#2E8060',
  primaryText: '#FFFFFF',
  primaryPale: '#0D2018',
  paidBg: '#0A1E14', paidText: '#4EC88A', paidDot: '#4EC88A',
  dueBg: '#221210', dueText: '#E87060', dueDot: '#E87060',
  futureBg: '#1A1C1A', futureText: '#4E5854', futureDot: '#363C38',
  border: '#262E2A',
  borderLight: '#1E2420',
  inputBg: '#1C2220',
  mutedSurface: '#161A18',
  navBg: '#1C2220',
};

export type AccentTone = 'green' | 'purple' | 'blue';

function getInitialAccent(): AccentTone {
  try {
    const saved = localStorage.getItem('lumina_accent');
    return saved === 'purple' || saved === 'blue' ? saved : 'green';
  } catch { return 'green'; }
}

const purpleLight: ThemeTokens = {
  ...light, primary: '#694391', primaryPale: '#F2ECF8',
};

const purpleDark: ThemeTokens = {
  ...dark, primary: '#9C77C4', primaryPale: '#271D34',
};

const blueLight: ThemeTokens = {
  ...light, primary: '#285A91', primaryPale: '#EAF2FC',
};

const blueDark: ThemeTokens = {
  ...dark, primary: '#85B8F2', primaryPale: '#172B43',
};

interface ThemeCtx {
  darkMode: boolean;
  accentTone: AccentTone;
  setAccentTone: (tone: AccentTone) => void;
  setDarkMode: (v: boolean) => void;
  t: ThemeTokens;
}

const ThemeContext = createContext<ThemeCtx>({
  darkMode: false,
  accentTone: 'green',
  setAccentTone: () => {},
  setDarkMode: () => {},
  t: light,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [accentTone, setAccentToneState] = useState<AccentTone>(getInitialAccent);
  const setAccentTone = (tone: AccentTone) => {
    setAccentToneState(tone);
    try { localStorage.setItem('lumina_accent', tone); } catch {}
  };
  const theme = accentTone === 'purple'
    ? (darkMode ? purpleDark : purpleLight)
    : accentTone === 'blue'
      ? (darkMode ? blueDark : blueLight)
      : (darkMode ? dark : light);

  useEffect(() => {
    document.documentElement.style.setProperty('--app-background', theme.bg);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.bg);
  }, [theme.bg]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, accentTone, setAccentTone, t: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
