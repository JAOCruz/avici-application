import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en/translation.json';
import esTranslations from '../locales/es/translation.json';

export const initI18n = async () => {
  await i18next.use(LanguageDetector).init({
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

  return i18next;
};

export const t = (key: string, options?: any) => i18next.t(key, options);
export const changeLanguage = (lng: string) => i18next.changeLanguage(lng);
export const getCurrentLanguage = () => i18next.language || 'en';

// Helper to convert hyphenated IDs to camelCase for translation keys
const hyphenToCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

// Helper to translate feature data
export const translateFeature = (featureId: string, field: 'name' | 'description' | 'highlights' | 'options') => {
  // Convert hyphenated IDs (contact-form) to camelCase (contactForm) for translation keys
  const camelCaseId = hyphenToCamelCase(featureId);
  const key = `features.${camelCaseId}.${field}`;
  const translation = i18next.t(key, { returnObjects: true });
  
  // Check if translation exists (not the same as the key)
  const isTranslated = translation !== key && translation !== `features.${camelCaseId}.${field}`;
  
  // If translation returns an object/array, return it
  if (typeof translation === 'object' && translation !== null && !Array.isArray(translation)) {
    return translation;
  }
  if (Array.isArray(translation)) {
    return translation;
  }
  // If translation exists and is a string, return it; otherwise return null to fallback
  if (isTranslated && typeof translation === 'string') {
    return translation;
  }
  return null;
};

