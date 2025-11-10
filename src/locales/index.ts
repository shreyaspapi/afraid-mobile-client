import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import ja from './ja';
import pt from './pt';
import zh from './zh';

export const translations = {
  en,
  es,
  fr,
  de,
  pt,
  zh,
  ja,
};

export type TranslationKeys = keyof typeof en;
export type LocaleCode = keyof typeof translations;

export const localeNames: Record<LocaleCode, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  zh: '简体中文',
  ja: '日本語',
};
