import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type LangKey } from './translations';

interface LangCtx {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  tr: (key: keyof typeof translations.en) => string;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
}

const LangContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  tr: (k) => translations.en[k],
  isRTL: false,
  dir: 'ltr',
});

function getInitialLang(): LangKey {
  try {
    const stored = localStorage.getItem('lumina_lang');
    if (stored === 'fa' || stored === 'en') return stored;
  } catch {}
  return 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangKey>(getInitialLang);

  const setLang = (l: LangKey) => {
    setLangState(l);
    try { localStorage.setItem('lumina_lang', l); } catch {}
  };

  const tr = (key: keyof typeof translations.en) => translations[lang][key] ?? translations.en[key];
  const isRTL = lang === 'fa';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';

  return (
    <LangContext.Provider value={{ lang, setLang, tr, isRTL, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
